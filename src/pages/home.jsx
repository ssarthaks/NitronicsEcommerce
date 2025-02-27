import React from 'react';
import FeaturedProducts from '../components/homepage/FeaturedProducts'
import Hero from '../components/homepage/Hero';
import Testimonials from '../components/homepage/Testimonials';
import Banner from '../components/homepage/Banner';
import Banner2 from '../components/homepage/Banner2';
import Newsletter from '../components/homepage/NewsLetter';

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Banner/>
      <Banner2/>
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
