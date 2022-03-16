import { useState, useEffect } from 'react';
import axios from 'axios';

function useFetchData(config) {
  // eslint-disable-next-line no-unused-vars
  const [results, setResults] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localisationToCity = (name) => {
      let loc = '';
      switch (name.toLowerCase()) {
        case 'ośrodek konferencyjno-wypoczynkowy hyrny':
          loc = 'Zakopane';
          break;
        case 'hotel elbrus':
          loc = 'Szczyrk';
          break;
        case 'online':
          loc = 'ONLINE';
          break;
        default:
          loc = '';
          break;
      }
      return loc;
    };

    // Funkcja zamieniająca zakres dat w formie tekstowej na prawdziwe daty
    const parseCourseDates = (dateRange) => {
      const startDate = () => {
        const day = dateRange.substring(0, dateRange.indexOf('.'));
        const month = dateRange.substring(dateRange.indexOf('.') + 1, 5);
        return Date.parse(`${new Date().getFullYear()}-${month}-${day}`);
      };

      const endDate = () => {
        if (dateRange.length <= 5) return startDate();
        const day = dateRange.substring(
          dateRange.lastIndexOf(' ') + 1,
          dateRange.lastIndexOf(' ') + 3
        );
        const month = dateRange.substring(
          dateRange.lastIndexOf('.') + 1,
          dateRange.length
        );
        return Date.parse(`${new Date().getFullYear()}-${month}-${day}`);
      };
      return { startDate: startDate(), endDate: endDate() };
    };

    // Funkcja wyodrębniająca potrzebne dane z JSON-a dostarzczonego przez API
    const processData = (data) => {
      // W tablicy preProcessedData kolekcjonuję obiekty z danymi każdego szkolenia wyselekcjowanymi z kalendarza szkoleń pobranego z API.
      const preProcessedData = [];
      // Z każdego elementu kalendarza szkoleń wyciągam kod, tytuł, datę, lokalizację i url szkolenia. Pomijam szkolenia indywisualne
      data.forEach((item) => {
        const itemObj = {};
        const excludedCodesRegex = /INDW.*/;
        if (!item.acf.kod_szkolenia.match(excludedCodesRegex)) {
          itemObj.code = item.acf.kod_szkolenia;
          itemObj.title =
            item.title.rendered.lastIndexOf('&#8211;') !== -1
              ? item.title.rendered.substring(
                  0,
                  item.title.rendered.lastIndexOf('&#8211;') - 1
                )
              : item.title.rendered;
          itemObj.date = item.uagb_excerpt.substring(
            0,
            item.uagb_excerpt.lastIndexOf('@') - 1
          );
          const localisation = item.content.rendered.substring(
            item.content.rendered.lastIndexOf('<a'),
            item.content.rendered.lastIndexOf('</a>')
          );
          itemObj.localisation = localisationToCity(
            localisation.substring(localisation.lastIndexOf('>') + 1)
          );
          itemObj.url = item.link;
          preProcessedData.push(itemObj);
        }
      });

      // Redukuję tablicę preProcessedData do tablicy processedData, zawierających posortowaną listę szkoleń z dostępnymi dla danego szkolenia terminami.
      const processedData = preProcessedData
        .reduce((total, currentObj) => {
          if (!total.find((item) => item.code === currentObj.code)) {
            // Do każdego rodzaju szkolenia ustalam pozycję na liście, zgodną z parametrem "pos" obiektu z tablicy "courseCode" pliku konfiguracyjnego "config"
            const positionIndicator = config.courseCode.find(
              (item) => item.abr.toString() === currentObj.code.toString()
            );
            // Zamieniam dziwne znaczki w tytule
            const title = currentObj.title.replace('&#8211;', '– ');
            const dates = parseCourseDates(currentObj.date);
            total.push({
              position: positionIndicator.pos || 1,
              code: currentObj.code,
              title,
              url: currentObj.url,
              date: [{ ...dates, localisation: currentObj.localisation }],
            });
          } else {
            const dates = parseCourseDates(currentObj.date);
            total
              .find((item) => item.code === currentObj.code)
              .date.push({ ...dates, localisation: currentObj.localisation });
          }

          // Segreguję daty szkoleń dla każdego rodzaju szkolenia i usuwam daty z przeszłości
          total.forEach((item) => {
            item.date.sort((a, b) => a.startDate - b.startDate);
          });

          return total;
        }, [])
        .sort((a, b) => a.position - b.position);
      console.log(processedData);
      setResults(processedData);
    };

    if (!config.url) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(config.url);
        setLoading(false);
        setError(null);
        processData(response.data);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [config]);
  return { results, isLoading, error };
}

export default useFetchData;
