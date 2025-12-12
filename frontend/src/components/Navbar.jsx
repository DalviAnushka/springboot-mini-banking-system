import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      
      <div style={styles.left}>
        <img
          src="/banklogo.jpg"
          alt="logo"
          style={styles.logoImage}
        />
        <span style={styles.brandName}>Mini Bank</span>
      </div>

      <div style={styles.right}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/create" style={styles.link}>Create Account</Link>
        <Link to="/transactions" style={styles.link}>Transactions</Link>
        <Link to="/analytics" style={styles.link}>Analytics</Link>
      </div>

    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 45px",
    background: "linear-gradient(90deg, #9D0208, #D00000, #F48C06)", 
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  logoImage: {
    width: "40px",
    height: "40px",
    marginRight: "12px",
    borderRadius: "50%",
    backgroundColor: "white",
    padding: "5px"
  },

  left: {
    display: "flex",
    alignItems: "center"
  },

  brandName: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "1px",
    color: "white",
    textShadow: "1px 1px 8px rgba(255,255,255,0.6)"
  },

  right: {
    display: "flex",
    gap: "25px"
  },

  link: {
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    textDecoration: "none",
    transition: "0.3s",
  }
};
