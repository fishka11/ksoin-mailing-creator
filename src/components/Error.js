/* eslint-disable react/prop-types */
import React from 'react';

export default function Error({ error }) {
  return (
    <div role="alert">
      Coś poszło nie tak.
      <br />
      {`${error}`}
    </div>
  );
}
