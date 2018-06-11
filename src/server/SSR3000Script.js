import React from 'react';
import { SSR3000Context } from './context';
import { sortExternalsToTop } from '../webpack/utils';
export const SSR3000Head = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 => SSR3000.chunks.js.sort(sortExternalsToTop).map(s => (
        <script key={s} src={s}/>
      ))
      
    }
  </SSR3000Context.Consumer>
);

export const SSR3000Main = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 => (
        <div id="root">
          <SSR3000.App/>
        </div>
      )
    }
  </SSR3000Context.Consumer>
);

const SSR3000Script = () => (
  <SSR3000Context.Consumer>
    {
      SSR3000 =>
      <script dangerouslySetInnerHTML={{
          __html: `window.__SSR3000.render.default(window.__SSR3000.${SSR3000.entry});`
      }}/>
    }
  </SSR3000Context.Consumer>
);

export default SSR3000Script;
