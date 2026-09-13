/**
 * Runs before first paint, blocking, from the document head.
 * Sets the theme attribute so there is never a flash of the wrong surface,
 * and adds the `js` class that gates every scroll reveal, so a page with
 * JavaScript disabled ships its content already visible.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('theme');var light=window.matchMedia('(prefers-color-scheme: light)').matches;var t=(s==='light'||s==='dark')?s:(light?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}document.documentElement.classList.add('js');})();`
