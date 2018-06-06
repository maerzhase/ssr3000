/* eslint-disable */
import React, { Component } from 'react';

const doc = (chunks, App) => {	
	const scripts = chunks.map(script => {
		return <script key={script} src={script}/>
	});
	class Document extends Component {
	  render() {
	  	return (
		    <html>
	        <head>
	        	<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"/>
						<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"/>
	        	<script src="https://unpkg.com/babel-standalone@6/babel.min.js"/>
	        	{
							scripts
						}
	        </head>
	        <body>
	          <div id="root">
	          	<App />
	          </div>
						<script dangerouslySetInnerHTML={{
							__html: 'window.__SSR3000.render.default(window.__SSR3000.index);'
						}}/>
	        </body>
		    </html>
	  	);
	  }
	}
	return Document;
}

export default doc;

