import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Star,
  ExternalLink,
  Zap,
  Upload,
  FileText,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const FREE_COURSES = [
  { 
    id: 1, 
    title: "Full Stack Web Development", 
    provider: "Great Learning", 
    duration: "15+ Hours", 
    rating: 4.8, 
    level: "Beginner",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/introduction-to-full-stack-development",
    isFree: true 
  },
  { 
    id: 2, 
    title: "Responsive Web Design Certification", 
    provider: "FreeCodeCamp", 
    duration: "300 Hours", 
    rating: 4.9, 
    level: "All Levels",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    isFree: true 
  },
  { 
    id: 3, 
    title: "Fundamentals of Digital Marketing", 
    provider: "Google Digital Garage", 
    duration: "40 Hours", 
    rating: 4.7, 
    level: "Beginner",
    url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
    isFree: true 
  },
  { 
    id: 4, 
    title: "HTML, CSS, and JS for Web Developers", 
    provider: "Coursera (Audit)", 
    duration: "25+ Hours", 
    rating: 4.8, 
    level: "Intermediate",
    url: "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
    isFree: true 
  },
  { 
    id: 5, 
    title: "Python for Data Science", 
    provider: "Great Learning", 
    duration: "10+ Hours", 
    rating: 4.7, 
    level: "Beginner",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/python-for-data-science",
    isFree: true 
  },
  { 
    id: 6, 
    title: "JavaScript Algos & Data Structures", 
    provider: "FreeCodeCamp", 
    duration: "300 Hours", 
    rating: 4.9, 
    level: "Advanced",
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    isFree: true 
  },
  { 
    id: 7, 
    title: "Foundations of UX Design", 
    provider: "Coursera (Google)", 
    duration: "20+ Hours", 
    rating: 4.8, 
    level: "Beginner",
    url: "https://www.coursera.org/learn/foundations-user-experience-design",
    isFree: true 
  },
  { 
    id: 8, 
    title: "Java Programming Masterclass", 
    provider: "Great Learning", 
    duration: "12+ Hours", 
    rating: 4.6, 
    level: "Intermediate",
    url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/java-programming",
    isFree: true 
  }
];

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { mockSkillGap } from '../../data/mockData';
import resumeService from '../../services/resumeService';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function LearningRecommendations() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const skillGapData = analysisResult ?
    analysisResult.skills.map(skill => ({
      skill,
      current: 70 + Math.random() * 20, // Simulated current for radar
      market: 90,
      fullMark: 100,
    })) :
    Object.keys(mockSkillGap.current).map(skill => ({
      skill,
      current: mockSkillGap.current[skill],
      market: mockSkillGap.market[skill],
      fullMark: 100,
    }));

  const getSearchUrl = (title, platform) => {
    if (!title) return "#";
    const queries = {
      "Udemy": `https://www.udemy.com/courses/search/?q=${encodeURIComponent(title)}`,
      "Coursera": `https://www.coursera.org/search?query=${encodeURIComponent(title)}`,
      "Great Learning": `https://www.mygreatlearning.com/academy/learn-for-free/search?q=${encodeURIComponent(title)}`,
      "Google": `https://www.google.com/search?q=${encodeURIComponent(title + " course")}`,
      "FreeCodeCamp": `https://www.freecodecamp.org/learn/search?q=${encodeURIComponent(title)}`
    };
    return queries[platform] || `https://www.google.com/search?q=${encodeURIComponent(title + " " + (platform || "") + " course")}`;
  };

  const recommendedCourses = analysisResult ?
    analysisResult.recommendedCourses.map((course, id) => ({
      id: `ai-${id}`,
      title: course.title || course,
      provider: course.platform || "Recommended Provider",
      duration: "Self-paced",
      rating: 4.9,
      level: "Intermediate",
      recommended: true,
      isFree: true,
      url: getSearchUrl(course.title || course, course.platform)
    })) :
    FREE_COURSES.filter(c => c.id <= 4);

  const allCourses = analysisResult ?
    [...recommendedCourses, ...FREE_COURSES.slice(0, 4)] :
    FREE_COURSES;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      try {
        const response = await resumeService.analyzeResume(file);
        if (response.success) {
          setAnalysisResult(response.analysis);
          setUploadComplete(true);
          toast.success("Resume analyzed and profile updated successfully!");
        } else {
          toast.error(response.message || "Failed to analyze resume.");
        }
      } catch (err) {
        toast.error(err.message || "An error occurred.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-10 pb-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Career Growth</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Accelerate Your Learning Path
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Custom recommendations based on industry trends and your unique skill profile.
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="space-y-8">

        {/* Analysis & Resume */}
        <div className="space-y-8">

          {/* Resume Upload Section */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-2 border-dashed border-indigo-200 bg-white hover:border-indigo-400 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4">
                <BrainCircuit className="w-24 h-24 text-indigo-50 opacity-10 rotate-12" />
              </div>

              <div className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Upload className="w-10 h-10 text-indigo-600" />
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Personalize Your Path</h3>
                    <p className="text-gray-500">
                      Upload your resume to get AI-driven skill gap alerts and tailored course suggestions.
                    </p>

                    <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                      {!uploadComplete ? (
                        <div className="relative">
                          <input
                            type="file"
                            className="hidden"
                            id="resume-upload"
                            accept=".pdf"
                            onChange={handleFileUpload}
                          />
                          <Button
                            asChild
                            className={`bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            <label htmlFor="resume-upload" className="cursor-pointer flex items-center gap-2">
                              {isUploading ? <Clock className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              {isUploading ? "Analyzing..." : "Upload Resume"}
                            </label>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Analysis Complete: {fileName}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => { setUploadComplete(false); setAnalysisResult(null); }} className="text-indigo-600 hover:text-indigo-800">
                            Upload different resume
                          </Button>
                        </div>
                      )}
                      {!uploadComplete && (
                        <Button variant="outline" className="border-gray-200">
                          Try Sample Data
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-medium text-indigo-600">
                      <span>Extracting profile intelligence...</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-1.5 bg-indigo-50" />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Skill Gap Analysis Section - Fresh Redesign */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white shadow-2xl shadow-indigo-100/30 border-0 rounded-3xl">
              <div className="bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-900 p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                      <BrainCircuit className="w-7 h-7 text-indigo-100" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Skill Intelligence</h3>
                      <p className="text-indigo-200 text-sm font-medium">Real-time market alignment & gap analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm self-start md:self-center px-4 py-2 rounded-xl border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Market Sync Active</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid lg:grid-cols-5 gap-12">
                  {/* Radar Chart Area */}
                  <div className="lg:col-span-3">
                    <div className="h-[400px] w-full bg-gray-50/50 rounded-3xl p-6 border border-gray-100 relative group">
                      <div className="absolute top-4 left-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Competency Matrix</div>

                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillGapData}>
                          <defs>
                            <linearGradient id="yourSkillGradient" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6} />
                            </linearGradient>
                          </defs>
                          <PolarGrid stroke="#e2e8f1" strokeDasharray="3 3" />
                          <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: '#475569', fontSize: 11, fontWeight: 700, letterSpacing: '0.025em' }}
                          />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="Your Current Mastery"
                            dataKey="current"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="url(#yourSkillGradient)"
                            fillOpacity={0.6}
                          />
                          <Radar
                            name="Industry High Demand"
                            dataKey="market"
                            stroke="#cbd5e1"
                            strokeWidth={1}
                            fill="#f1f5f9"
                            fillOpacity={0.4}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '16px',
                              border: 'none',
                              boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)',
                              padding: '12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter mx-2">{value}</span>}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Priority Cards Area */}
                  <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="flex items-center gap-2 font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">
                        Priority Targets
                      </h4>
                      <Badge variant="outline" className="text-[10px] font-black text-indigo-600 border-indigo-200">High Impact</Badge>
                    </div>

                    <div className="space-y-4">
                      {analysisResult ? (
                        <div className="space-y-6">
                          {/* Role Context */}
                          <div className="bg-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                              <Star className="w-16 h-16 fill-white" />
                            </div>
                            <div className="relative z-10">
                              <h5 className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">AI Recommendation</h5>
                              <div className="text-xl font-black">{analysisResult.suggestedRole}</div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 cursor-default">{analysisResult.experienceLevel}</Badge>
                                <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-tighter">Optimal Career Fit</span>
                              </div>
                            </div>
                          </div>

                          {/* Priority Targets - AI Recommended Skills */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Critical Skill Gaps</h5>
                              <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-amber-600">HIGH DEMAND</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {analysisResult.recommendedSkills.map((skill, index) => (
                                <motion.div
                                  key={skill}
                                  initial={{ x: 20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 * index }}
                                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Target className="w-4 h-4" />
                                      </div>
                                      <span className="font-bold text-gray-800 tracking-tight">{skill}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-600 flex items-center gap-1 uppercase">
                                      Grow <ArrowRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                      <span>Market Mastery Target</span>
                                      <span>85%</span>
                                    </div>
                                    <Progress value={20} className="h-1.5 bg-gray-50 overflow-hidden rounded-full [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500" />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        Object.keys(mockSkillGap.market).filter(skill =>
                          (mockSkillGap.market[skill] - (mockSkillGap.current[skill] || 0)) > 5
                        ).slice(0, 3).map((skill, index) => {
                          const current = mockSkillGap.current[skill] || 0;
                          const market = mockSkillGap.market[skill];
                          const gap = market - current;

                          return (
                            <motion.div
                              key={skill}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + (index * 0.1) }}
                              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrendingUp className="w-5 h-5 text-indigo-200" />
                              </div>

                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <span className="font-bold text-gray-800 tracking-tight">{skill}</span>
                                </div>
                                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase">+{gap}% Gap</span>
                              </div>
                              <Progress value={(current / market) * 100} className="h-2.5 bg-gray-100 rounded-full" />
                            </motion.div>
                          );
                        })
                      )}
                    </div>

                    <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all group">
                      View Advanced Analytics
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
          {analysisResult && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-8 rounded-3xl overflow-hidden relative">
                <Sparkles className="absolute top-0 right-0 w-64 h-64 text-white/5 -rotate-12" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6 text-indigo-200" />
                    </div>
                    <h4 className="text-xl font-bold">AI Career Summary</h4>
                  </div>
                  <p className="text-indigo-100 text-lg md:text-xl font-medium italic leading-relaxed">
                    "{analysisResult.careerSummary}"
                  </p>

                  <div className="pt-4 space-y-4">
                    <h5 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Recommended To Upskill</h5>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendedSkills.map(skill => (
                        <Badge key={skill} className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-3 py-1 text-sm font-medium cursor-pointer">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>



    </motion.div>
  );
}






