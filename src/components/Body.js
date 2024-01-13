import React, { useState } from 'react';
import Header from './headers/Header';
import Main from './mains/Main';
import Footer from './footers/Footer';

const Body = () => {

  return (
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Main />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Body;
