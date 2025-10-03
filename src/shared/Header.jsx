import styles from './Header.module.css';
import { NavLink } from 'react-router';

function Header({ title }) {
  return (
    <div className={styles['header']}>
      <div className={styles['header-container']}>
        <h1>{title}</h1>
        <nav>
          <NavLink to="/" className={styles['navlink']}>
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => {
              return isActive ? styles['navlink-active'] : styles['navlink'];
            }}
          >
            About
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Header;
