'use client';

import React, { useState, useEffect } from 'react';
import { AdminLogin } from '../../components/Admin/AdminLogin';
import { DashboardLayout } from '../../components/Admin/DashboardLayout';
import { ManageHero } from '../../components/Admin/ManageHero';
import { ManageAbout } from '../../components/Admin/ManageAbout';
import { ManageProjects } from '../../components/Admin/ManageProjects';
import { ManageSkills } from '../../components/Admin/ManageSkills';
import { ManageServices } from '../../components/Admin/ManageServices';
import { ManageTestimonials } from '../../components/Admin/ManageTestimonials';
import { ManageSettings } from '../../components/Admin/ManageSettings';
import { ManageExperience } from '../../components/Admin/ManageExperience';
import { ManageCourses } from '../../components/Admin/ManageCourses';
import { ManageWhyUs } from '../../components/Admin/ManageWhyUs';
import { ManageMessages } from '../../components/Admin/ManageMessages';
import { AdminOverview } from '../../components/Admin/AdminOverview';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setIsAuthenticated(true);
    } else {
      const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
      setIsAuthenticated(Boolean(token));
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;
      case 'hero':
        return <ManageHero />;
      case 'about':
        return <ManageAbout />;
      case 'projects':
        return <ManageProjects />;
      case 'skills':
        return <ManageSkills />;
      case 'services':
        return <ManageServices />;
      case 'testimonials':
        return <ManageTestimonials />;
      case 'settings':
        return <ManageSettings />;
      case 'experiences':
        return <ManageExperience />;
      case 'courses':
        return <ManageCourses />;
      case 'why_us':
        return <ManageWhyUs />;
      case 'messages':
        return <ManageMessages />;
      default:
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
