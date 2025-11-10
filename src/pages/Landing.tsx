import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, BarChart3, Bell, CheckCircle, Shield } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Smart Complaint System',
      description: 'AI-powered categorization and priority detection for faster resolution',
    },
    {
      icon: Users,
      title: 'Real-Time Communication',
      description: 'Direct messaging between students and staff for instant clarification',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track complaints, monitor performance, and identify trends',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Stay updated with instant alerts for every complaint update',
    },
    {
      icon: CheckCircle,
      title: 'Status Tracking',
      description: 'Follow your complaints from submission to resolution',
    },
    {
      icon: Shield,
      title: 'Secure & Anonymous',
      description: 'Option to submit complaints anonymously with full data protection',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-16 h-16 text-primary" />
            <h1 className="text-5xl font-bold">BroConnect</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            Your Voice, Your Solution
          </p>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
            An intelligent platform for Brototype students and staff to raise issues, 
            track resolutions, and communicate effectively. Transform how feedback is 
            handled with AI-powered insights and real-time collaboration.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create a transparent, efficient complaint management system
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="shadow-card hover:shadow-hover transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl shadow-hover p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Transparency</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">AI</div>
              <div className="text-muted-foreground">Powered Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join BroConnect today and experience a new way of handling complaints and feedback
          </p>
          <Button asChild size="lg" className="bg-gradient-secondary">
            <Link to="/auth">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
