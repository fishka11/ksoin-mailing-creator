/* eslint-disable arrow-body-style */
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './mailing.scss';

export default function Content({ results, utm }) {
  // const checkDate = (date) => {
  //   date
  // }
  return (
    <>
      <div className="col">
        {results &&
          results.map((result) => (
            <module key={results.code} label="1/1 Text" auto="">
              <table
                className="wrap"
                role="presentation"
                width="600"
                cellSpacing="0"
                cellPadding="0"
              >
                <tbody>
                  <tr>
                    <td valign="top">
                      <table
                        role="presentation"
                        cellSpacing="0"
                        cellPadding="0"
                      >
                        <tbody>
                          <tr>
                            <td width="600" valign="top" align="left">
                              <h2>
                                <single label="Headline">
                                  <a
                                    data-mce-href={`${result.url}${utm}`}
                                    href={`${result.url}${utm}`}
                                  >
                                    {result.title}
                                  </a>
                                  <br data-mce-bogus="1" />
                                </single>
                              </h2>
                              <multi label="Body">
                                {result.date.map((item) => {
                                  if (item.startDate > Date.now()) {
                                    return (
                                      <span
                                        key={`${item.startDate}${item.endDate}${
                                          item.localisation
                                        }${uuidv4()}`}
                                      >
                                        {`${new Date(item.startDate)
                                          .getDate()
                                          .toString()
                                          .padStart(2, '0')}.${(
                                          new Date(item.startDate).getMonth() +
                                          1
                                        )
                                          .toString()
                                          .padStart(2, '0')} - ${new Date(
                                          item.endDate
                                        )
                                          .getDate()
                                          .toString()
                                          .padStart(2, '0')}.${(
                                          new Date(item.endDate).getMonth() + 1
                                        )
                                          .toString()
                                          .padStart(2, '0')} / ${
                                          item.localisation
                                        }`}
                                        <br />
                                      </span>
                                    );
                                  }
                                  return null;
                                })}
                                <br />
                              </multi>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </module>
          ))}
      </div>
      <div className="col" />
    </>
  );
}
