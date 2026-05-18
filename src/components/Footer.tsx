import Link from "next/link";
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from "react-icons/fi";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles["footer-grid"]}>
          <div className={styles["footer-brand"]}>
            <h3>✦ Mediva Designs</h3>
            <p>
              Handcrafted mandala paintings that bring harmony, beauty, and spiritual energy to your space.
              Each piece is a unique work of art, created with love and precision.
            </p>
             <div className={styles["footer-socials"]}>
              <a href="https://www.instagram.com/an_aesthetic_canvas/" target="_blank" rel="noopener noreferrer" className={styles["footer-social-link"]} aria-label="Instagram"><FiInstagram /></a>
              <a href="mailto:avinash@medivadesigns.shop" className={styles["footer-social-link"]} aria-label="Email"><FiMail /></a>
            </div>

          </div>

          <div className={styles["footer-column"]}>
            <h4>Shop</h4>
            <Link href="/shop" className={styles["footer-link"]}>All Paintings</Link>
            <Link href="/shop?category=geometric" className={styles["footer-link"]}>Geometric</Link>
            <Link href="/shop?category=floral" className={styles["footer-link"]}>Floral</Link>
            <Link href="/shop?category=spiritual" className={styles["footer-link"]}>Spiritual</Link>
            <Link href="/shop?category=modern" className={styles["footer-link"]}>Modern</Link>
          </div>

          <div className={styles["footer-column"]}>
            <h4>Company</h4>
            <Link href="/about" className={styles["footer-link"]}>About Us</Link>
            <Link href="/contact" className={styles["footer-link"]}>Contact</Link>
            <Link href="#" className={styles["footer-link"]}>Shipping Policy</Link>
            <Link href="#" className={styles["footer-link"]}>Return Policy</Link>
          </div>

          <div className={styles["footer-column"]}>
            <h4>Newsletter</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-sm)" }}>
              Get updates on new collections & exclusive offers.
            </p>
            <div className={styles["footer-newsletter"]}>
              <input type="email" placeholder="Your email" />
              <button className="btn btn-primary btn-sm">→</button>
            </div>
          </div>
        </div>

        <div className={styles["footer-bottom"]}>
          <p>© {new Date().getFullYear()} Mediva Designs. All rights reserved.</p>
          <p>Made with ♥ for art lovers</p>
        </div>
      </div>
    </footer>
  );
}
