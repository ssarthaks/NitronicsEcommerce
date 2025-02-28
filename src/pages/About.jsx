import { motion } from "framer-motion"
import img from "../assets/aboutus.jpg"
import { Gamepad2, Cpu, Headphones } from "lucide-react"
import { Link } from "react-router-dom"

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="bg-nitro-black text-white min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <motion.h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" {...fadeIn}>
          About <span className="text-nitro-accent">Nitronics Gaming Store</span>
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <img
              src={img}
              alt="Our Store"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-nitro-gray-300 mb-6">
              Founded in 2015, Nitronics Gaming has been at the forefront of the gaming industry, providing high-quality
              gaming gear and cutting-edge technology. Our journey began with a simple idea: every gamer deserves the
              best tools to enhance their gaming experience.
            </p>
            <p className="text-nitro-gray-300 mb-6">
              Over the years, we've grown from a small local shop to a nationwide brand, but our commitment to quality
              and customer satisfaction remains unchanged. We believe in the power of technology to transform gaming and
              bring people together.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 bg-nitro-gray-800 p-8 rounded-lg shadow-lg"
          {...fadeIn}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-nitro-gray-300 mb-6">
            At Nitronics Gaming, our mission is to empower gamers with the latest and greatest in gaming technology. We
            strive to:
          </p>
          <ul className="list-disc list-inside text-nitro-gray-300 space-y-2 mb-6">
            <li>Provide high-quality, performance-driven gaming products</li>
            <li>Stay ahead of the curve with the latest gaming innovations</li>
            <li>Foster a vibrant and inclusive gaming community</li>
            <li>Offer expert advice and support for all levels of gamers</li>
          </ul>
        </motion.div>

        <motion.div className="mt-16 text-center" {...fadeIn} transition={{ delay: 0.8 }}>
          <h2 className="text-2xl font-semibold mb-4">Why Choose Nitronics Gaming?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              { title: "Cutting-Edge Products", description: "Latest gaming gear and accessories", icon: Gamepad2 },
              {
                title: "Expert Support",
                description: "Personalized recommendations from gaming enthusiasts",
                icon: Headphones,
              },
              { title: "Wide Range", description: "From budget-friendly to pro-level equipment", icon: Cpu },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-nitro-gray-800 p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-nitro-accent" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-nitro-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mt-16 text-center" {...fadeIn} transition={{ delay: 1 }}>
          <h2 className="text-2xl font-semibold mb-4">Join Our Gaming Community</h2>
          <p className="text-nitro-gray-300 mb-6">
            Stay updated with the latest gaming trends, exclusive offers, and tech tips.
          </p>
          <Link to="/login">
            <motion.button
              className="bg-nitro-accent text-nitro-black px-6 py-3 rounded-full font-semibold inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now <Gamepad2 className="ml-2" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default About

