import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Gaming Consoles", href: "#" },
        { name: "Accessories", href: "#" },
        { name: "PC Components", href: "#" },
        { name: "Headsets", href: "#" },
        { name: "Game Titles", href: "#" },
      ],
    },
    {
      title: "Information",
      links: [
        { name: "Our Story", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Terms & Conditions", href: "/privacy-policy" },
        { name: "Privacy Policy", href: "/terms-and-conditions" },
      ],
    },
    {
      title: "Quick Links",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-and-conditions" },
      ],
    },
    {
      title: "Contact",
      links: [
        {
          name: "Email: support@nitronicsgaming.com",
          href: "mailto:support@nitronicsgaming.com",
        },
        { name: "+977-9843346958", href: "tel:+977-984-3346958" },
        { name: "+977-9843346957", href: "tel:+977-984-3346957" },
        { name: "+977-9801090699", href: "tel:+977-980-1090699" },
        { name: "Help Center", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/nitronicsgaming",
      icon: FaFacebookF,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/nitronicsgaming",
      icon: FaInstagram,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/nitronicsgaming",
      icon: FaXTwitter,
    },
  ];

  return (
    <footer className="bg-nitro-black text-white py-8">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-wrap justify-center text-left text-sm">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              className="w-full md:w-1/4 mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-semibold mb-3 text-nitro-accent">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <motion.li key={link.name} whileHover={{ x: 5 }}>
                    <a
                      href={link.href}
                      className="hover:text-nitro-accent transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center space-x-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="flex items-center justify-center p-2 bg-transparent hover:bg-white hover:text-nitro-black rounded-full transition duration-300"
              aria-label={link.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <link.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-nitro-gray-300">
            © {currentYear} Nitronics Gaming. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
