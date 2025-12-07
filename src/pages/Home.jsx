// src/pages/Home.js
import React from 'react';
import CarouselSlider from '../components/CarouselSlider';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import CoursesSection from '../components/CoursesSection';
import GallerySection from '../components/GallerySection';
import NoticeModal from '../components/NoticeModal';
import NewsNoticeDownloadSection from '../components/NewsNoticeDownloadSection';
import PrincipalMessage from '../components/PrincipalMessage';
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Load bootstrap JS only here


export default function Home() {
  return (
    <>
      <NoticeModal />
      <CarouselSlider />
      <NewsNoticeDownloadSection />
      <AboutSection />
      <PrincipalMessage />
      <FeaturesSection />
      <CoursesSection />
      <GallerySection />
    </>
  );
}
