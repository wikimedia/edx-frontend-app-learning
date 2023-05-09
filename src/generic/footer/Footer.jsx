import React from 'react'

const Footer = () => {

  return (
    <div class="wrapper wrapper-footer">
        <footer id="footer-openedx" class="footer">
            <div class="footer-container">
            <nav class="nav-colophon" aria-label="${_('About')}">
                <ol>
                <li class="nav-colophon">
                    <a href="https://wikimediafoundation.org/privacy-policy/" target="_blank">Privacy Policy</a>
                </li>
                <li class="nav-colophon">
                    <a href="https://edly.io/euserpp/" target="_blank">"Edly Privacy Policy"</a>
                </li>
                </ol>
            </nav>

            <div class="wrapper-logo">
                <p>
                <a href="/">
                    <img alt="'organization logo'" src={`${process.env.LOGO_URL}`}/>
                </a>
                </p>
            </div>
            </div>
        </footer>
    </div>

  )
}

export default Footer
