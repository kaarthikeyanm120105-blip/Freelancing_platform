import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Avatar } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { Edit, Plus, Award, Briefcase, GraduationCap, ExternalLink, CheckCircle, Save, X, Camera, Trash2, Loader2, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

export default function FreelancerProfile() {
  const { user, refreshUser } = useAuth();
  const [activeSection, setActiveSection] = useState(null); // 'info', 'bio', 'education', 'skills', 'portfolio', 'certifications'
  const [isSaving, setIsSaving] = useState(false);

  // Local state for profile fields
  const [editForm, setEditForm] = useState({
    fullName: '',
    title: '',
    bio: '',
    skills: [],
    education: [],
    portfolio: [],
    portfolioLinks: [],
    certifications: [],
  });

  // Track file uploads
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Sync editForm with user data
  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        title: user.title || '',
        bio: user.bio || '',
        skills: user.skills || [],
        education: user.education || [],
        portfolio: user.portfolio || [],
        portfolioLinks: user.portfolioLinks || [],
        certifications: user.certifications || [],
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSectionSave = async (section) => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // We send everything in the current editForm state
      // The backend will handle parsing the stringified arrays
      formData.append('fullName', editForm.fullName);
      formData.append('title', editForm.title);
      formData.append('bio', editForm.bio);
      formData.append('skills', JSON.stringify(editForm.skills));
      formData.append('education', JSON.stringify(editForm.education));
      formData.append('portfolio', JSON.stringify(editForm.portfolio));
      formData.append('portfolioLinks', JSON.stringify(editForm.portfolioLinks));
      formData.append('certifications', JSON.stringify(editForm.certifications));

      // Append files if they exist
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const { data } = await api.post('/auth/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated!`);
        await refreshUser();
        setActiveSection(null);
        setProfileImageFile(null);
        setResumeFile(null);
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to get full URL for images/files
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  };

  const handleAddField = (type) => {
    if (type === 'education') {
      setEditForm(prev => ({
        ...prev,
        education: [...prev.education, { institution: '', stream: '', yearCompleted: new Date().getFullYear() }]
      }));
    } else if (type === 'portfolio') {
      setEditForm(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { title: '', description: '', image: '', tags: [] }]
      }));
    } else if (type === 'certifications') {
      setEditForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, { name: '', issuer: '', date: new Date().toISOString().split('T')[0], link: '', verified: false }]
      }));
    } else if (type === 'portfolioLinks') {
      setEditForm(prev => ({
        ...prev,
        portfolioLinks: [...prev.portfolioLinks, '']
      }));
    }
  };

  const handleRemoveField = (type, index) => {
    setEditForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (type, index, field, value) => {
    if (type === 'portfolioLinks') {
      setEditForm(prev => ({
        ...prev,
        portfolioLinks: prev.portfolioLinks.map((item, i) => i === index ? value : item)
      }));
      return;
    }
    setEditForm(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">My Profile</h2>
          <p className="text-gray-600">Manage your professional profile and portfolio</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden border-4 border-white shadow-lg">
                  {user.profileImage ? (
                    <img src={getFullUrl(user.profileImage)} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    user.fullName?.[0] || 'U'
                  )}
                </div>
                {activeSection === 'info' && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setProfileImageFile(e.target.files[0]);
                          toast.success('Image selected: ' + e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {activeSection === 'info' ? (
                <div className="space-y-4 mb-6 text-left">
                  <div className="space-y-1">
                    <Label>Full Name</Label>
                    <Input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Professional Title</Label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Full Stack Developer"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setActiveSection(null)}>Cancel</Button>
                    <Button size="sm" className="flex-1 bg-indigo-600" onClick={() => handleSectionSave('info')} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative group mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setActiveSection('info')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <h3 className="text-xl font-semibold mb-1">{user.fullName}</h3>
                  <p className="text-gray-600 mb-2">{user.title || 'Freelancer'}</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                  <span className="text-gray-600">Employability</span>
                  <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
                    {user.employabilityScore || 0}/100
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-gray-900">{user.completedProjects || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    {user.rating || 0} <CheckCircle className="w-4 h-4 text-green-500 fill-green-50" />
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Resume Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-lg text-black">Resume</h3>
              </div>
              {activeSection === 'resume' ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                  <Button size="sm" className="bg-indigo-600" onClick={() => handleSectionSave('resume')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('resume')} className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  {user.resume ? <Edit className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  {user.resume ? 'Update' : 'Upload'}
                </Button>
              )}
            </div>

            {activeSection === 'resume' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer group relative">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                        toast.success('Resume selected: ' + e.target.files[0].name);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-indigo-600" />
                    </div>
                    <p className="font-medium text-gray-900 text-xs">
                      {resumeFile ? resumeFile.name : 'Click to upload PDF resume'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">PDF (Max 5MB)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 overflow-hidden">
                  {user.resume ? (
                    <div>
                      <p className="font-medium text-gray-900 text-sm truncate">Professional CV</p>
                      <a
                        href={getFullUrl(user.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center mt-1"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> View CV
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No resume uploaded yet.</p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 pt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Education</h3>
                  </div>
                  {activeSection === 'education' ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSectionSave('education')} disabled={isSaving} className="bg-indigo-600">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAddField('education')} className="text-indigo-600">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('education')}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {(activeSection === 'education' ? editForm.education : (user.education || [])).map((edu, idx) => (
                    <div key={idx} className="relative group">
                      {activeSection === 'education' ? (
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                            onClick={() => handleRemoveField('education', idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="md:col-span-2 space-y-1">
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateArrayField('education', idx, 'institution', e.target.value)}
                              placeholder="e.g. Stanford University"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Stream / Major</Label>
                            <Input
                              value={edu.stream}
                              onChange={(e) => updateArrayField('education', idx, 'stream', e.target.value)}
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Year Completed</Label>
                            <Input
                              type="number"
                              value={edu.yearCompleted}
                              onChange={(e) => updateArrayField('education', idx, 'yearCompleted', e.target.value)}
                              placeholder="2025"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-100">
                            <GraduationCap className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{edu.institution}</div>
                            <div className="text-sm text-gray-600">{edu.stream}</div>
                            <div className="text-xs text-indigo-600 font-medium mt-1">Class of {edu.yearCompleted}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {activeSection !== 'education' && (!user.education || user.education.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No education details added yet.</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Professional Bio</h3>
                  </div>
                  {activeSection === 'bio' ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSectionSave('bio')} disabled={isSaving} className="bg-indigo-600">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('bio')}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>
                {activeSection === 'bio' ? (
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell clients about your expertise and what you're passionate about..."
                    rows={6}
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {user.bio || 'Your bio is empty. Tap edit to tell the world about your skills!'}
                  </p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6 pt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Work Projects</h3>
                  </div>
                  {activeSection === 'portfolio' ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSectionSave('portfolio')} disabled={isSaving} className="bg-indigo-600">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Projects'}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('portfolio')}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {(activeSection === 'portfolio' ? editForm.portfolio : (user.portfolio || [])).map((item, index) => (
                    <Card key={index} className="overflow-hidden bg-white border-gray-100 group relative">
                      {activeSection === 'portfolio' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 z-10"
                          onClick={() => handleRemoveField('portfolio', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                        {item.image ? (
                          <img src={getFullUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Briefcase className="w-12 h-12" />
                          </div>
                        )}
                        {activeSection === 'portfolio' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="sm" onClick={() => toast.info('Image upload logic')}>
                              Change Image
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        {activeSection === 'portfolio' ? (
                          <>
                            <Input
                              value={item.title}
                              onChange={(e) => updateArrayField('portfolio', index, 'title', e.target.value)}
                              placeholder="Project Title"
                              className="font-semibold text-base"
                            />
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateArrayField('portfolio', index, 'description', e.target.value)}
                              placeholder="Description"
                              rows={3}
                              className="text-sm"
                            />
                            <Input
                              value={item.tags?.join(', ') || ''}
                              onChange={(e) => updateArrayField('portfolio', index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                              placeholder="Tags (comma separated)"
                              className="text-xs"
                            />
                          </>
                        ) : (
                          <>
                            <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.description}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {(item.tags || []).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] font-medium uppercase tracking-wider bg-gray-100 text-gray-600">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}

                  {activeSection === 'portfolio' && (
                    <Card
                      className="p-6 border-dashed border-2 flex items-center justify-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50/50 transition-all min-h-[300px]"
                      onClick={() => handleAddField('portfolio')}
                    >
                      <div className="text-center group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="font-medium text-indigo-600">Add New Project</div>
                      </div>
                    </Card>
                  )}
                </div>
              </Card>

              {/* Portfolio Links Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">Portfolio & Social Links</h3>
                  </div>
                  {activeSection === 'portfolioLinks' ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSectionSave('portfolioLinks')} disabled={isSaving} className="bg-indigo-600">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Links'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleAddField('portfolioLinks')} className="text-indigo-600">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('portfolioLinks')}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {(activeSection === 'portfolioLinks' ? editForm.portfolioLinks : (user.portfolioLinks || [])).map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      {activeSection === 'portfolioLinks' ? (
                        <>
                          <Input
                            value={link}
                            onChange={(e) => updateArrayField('portfolioLinks', idx, null, e.target.value)}
                            placeholder="https://github.com/yourprofile"
                            className="flex-1"
                          />
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveField('portfolioLinks', idx)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 flex-1 overflow-hidden">
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate text-sm">
                            {link}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  {activeSection !== 'portfolioLinks' && (!user.portfolioLinks || user.portfolioLinks.length === 0) && (
                    <p className="text-sm text-gray-500 italic">No links added yet.</p>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 pt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-lg">My Skills</h3>
                  </div>
                  {activeSection === 'skills' ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSectionSave('skills')} disabled={isSaving} className="bg-indigo-600">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Skills'}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setActiveSection('skills')}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {activeSection === 'skills' ? (
                    <div className="space-y-3">
                      <Label>Add Skills (Press Enter or use comma)</Label>
                      <Input
                        placeholder="React, Backend, Figma..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newSkill = e.target.value.trim();
                            if (newSkill && !editForm.skills.includes(newSkill)) {
                              setEditForm({ ...editForm, skills: [...editForm.skills, newSkill] });
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mt-4 max-h-48 overflow-y-auto p-1">
                        {editForm.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-indigo-600 text-white pl-3 pr-1 py-1.5 flex items-center gap-1 group"
                          >
                            {skill}
                            <button
                              onClick={() => setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skill) })}
                              className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {(user.skills || []).map((skill) => (
                        <Badge key={skill} className="bg-indigo-50 text-indigo-700 px-4 py-2 border-indigo-100 hover:bg-indigo-100 transition-colors">
                          {skill}
                        </Badge>
                      ))}
                      {(user.skills || []).length === 0 && (
                        <p className="text-sm text-gray-500 italic">Highlight your expertise by adding skills.</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg px-2">Certifications</h3>
                {activeSection === 'certifications' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveSection(null)}>Cancel</Button>
                    <Button size="sm" onClick={() => handleSectionSave('certifications')} disabled={isSaving} className="bg-indigo-600">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Certifications'}
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection('certifications')}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {(activeSection === 'certifications' ? editForm.certifications : (user.certifications || [])).map((cert, idx) => (
                  <Card key={idx} className="p-6 group relative">
                    {activeSection === 'certifications' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        onClick={() => handleRemoveField('certifications', idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-100">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        {activeSection === 'certifications' ? (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label>Certificate Name</Label>
                              <Input
                                value={cert.name}
                                onChange={(e) => updateArrayField('certifications', idx, 'name', e.target.value)}
                                placeholder="AWS Solutions Architect"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Issuer</Label>
                              <Input
                                value={cert.issuer}
                                onChange={(e) => updateArrayField('certifications', idx, 'issuer', e.target.value)}
                                placeholder="Amazon Web Services"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Date Earned</Label>
                              <Input
                                type="date"
                                value={cert.date?.split('T')[0] || ''}
                                onChange={(e) => updateArrayField('certifications', idx, 'date', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Verify Link</Label>
                              <Input
                                value={cert.link}
                                onChange={(e) => updateArrayField('certifications', idx, 'link', e.target.value)}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900 mb-1">{cert.name}</h4>
                              <p className="text-sm text-gray-600 font-medium">{cert.issuer}</p>
                              <p className="text-xs text-gray-500 mt-1">{cert.date ? new Date(cert.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''}</p>
                              {cert.link && (
                                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-2">
                                  <ExternalLink className="w-3 h-3" /> View Certificate
                                </a>
                              )}
                            </div>
                            {cert.verified && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 uppercase tracking-tighter text-[10px]">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {activeSection === 'certifications' && (
                  <Button
                    variant="outline"
                    className="w-full h-16 border-dashed border-2 hover:border-green-600 hover:bg-green-50 hover:text-green-600 transition-all"
                    onClick={() => handleAddField('certifications')}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Certification
                  </Button>
                )}

                {activeSection !== 'certifications' && (!user.certifications || user.certifications.length === 0) && (
                  <Card className="p-12 text-center border-dashed">
                    <Award className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 italic">No certifications added yet.</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}





