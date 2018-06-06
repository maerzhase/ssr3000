import React from 'react';

const SSR3000Script = () => (
  <script dangerouslySetInnerHTML={{
    __html: 'window.__SSR3000.render.default(window.__SSR3000.index);'
  }}/>
);

export default SSR3000Script;
