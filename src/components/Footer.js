import {Link} from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  return (
    <footer className="footer">
      <hr />
      <p>
        &copy; 2024-{currentYear} Astro Archive. All rights reserved. 
        <br />
        <Link to="/privacy-policy">隐私政策</Link> | <a href="mailto:astro.archive.contact@gmail.com">联系我们</a>
      </p>
    </footer>
  );
};

export default Footer;
