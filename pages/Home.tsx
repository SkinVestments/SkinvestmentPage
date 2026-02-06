import React from 'react';
import { Hero } from '../components/Hero';
import { DeepDive } from '../components/DeepDive';
import { Features } from '../components/Features';

export default function Home() {
  return (
    <>
      <Hero />
      <DeepDive />
      <Features />
    </>
  );
}
