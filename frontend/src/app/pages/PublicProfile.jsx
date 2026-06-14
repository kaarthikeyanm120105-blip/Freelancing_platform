import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
    MessageSquare, 
    Star, 
    Briefcase, 
    Building2, 
    GraduationCap, 
    Award, 
    ExternalLink, 
    FileText,
    ArrowLeft,
    Loader2,
    ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import userService from '../services/userService';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function PublicProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getPublicProfile(id);
                if (data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                toast.error("User not found");
                navigate('/connect');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, navigate]);

    const handleMessage = async () => {
        try {
            const conversation = await chatService.createConversation(null, currentUser?._id, id);
            navigate(`/messages/${conversation._id}`);
        } catch (error) {
            toast.error("Could not start message");
        }
    };

    const getFullUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:3000${path}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-tight">Fetching profile...</p>
            </div>
        );
    }

    if (!user) return null;

    const isFreelancer = user.role === 'freelancer';

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-indigo-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="space-y-6">
                    <Card className="p-8 border-none shadow-xl bg-white overflow-hidden text-center relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />
                        
                        <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-white shadow-2xl ring-4 ring-indigo-50">
                            <AvatarImage src={getFullUrl(user.profileImage || user.companyLogo)} />
                            <AvatarFallback className="bg-indigo-600 text-white font-extrabold text-4xl">
                                {user.fullName?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
                            {isFreelancer ? user.fullName : user.companyName}
                        </h2>
                        <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-6">
                            {isFreelancer ? user.title : user.industry}
                        </p>

                        <div className="flex items-center justify-center gap-6 mb-8 border-y py-6 border-gray-100">
                            <div className="text-center">
                                <div className="text-xl font-black text-gray-900 flex items-center justify-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {user.rating || 0}
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Rating</div>
                            </div>
                            <div className="w-px h-10 bg-gray-100" />
                            <div className="text-center">
                                <div className="text-xl font-black text-gray-900">
                                    {isFreelancer ? user.completedProjects || 0 : user.totalHires || 0}
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    {isFreelancer ? 'Projects' : 'Hires'}
                                </div>
                            </div>
                        </div>

                        <Button 
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest shadow-lg shadow-indigo-100"
                            onClick={handleMessage}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                        </Button>
                    </Card>

                    {isFreelancer && (
                        <Card className="p-6 border-none shadow-sm space-y-4">
                            <h3 className="font-black uppercase text-xs text-gray-400 tracking-widest">Pricing</h3>
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-700">Hourly Rate</span>
                                <span className="text-xl font-black text-indigo-600">₹{user.hourlyRate || 0}/hr</span>
                            </div>
                        </Card>
                    )}

                    {!isFreelancer && user.companyWebsite && (
                        <Card className="p-6 border-none shadow-sm space-y-4">
                            <h3 className="font-black uppercase text-xs text-gray-400 tracking-widest">Website</h3>
                            <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline font-bold text-sm truncate">
                                <ExternalLink className="w-4 h-4" />
                                {user.companyWebsite}
                            </a>
                        </Card>
                    )}
                </div>

                {/* Right Column: Detailed Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-white border p-1 grid grid-cols-3">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">Overview</TabsTrigger>
                            <TabsTrigger value="experience" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">Experience</TabsTrigger>
                            <TabsTrigger value="portfolio" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">Work</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <Card className="p-8 border-none shadow-sm space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-black uppercase text-sm tracking-widest">About</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed italic border-l-4 border-indigo-100 pl-6 py-2">
                                    "{user.bio || user.companyDescription || 'No description provided'}"
                                </p>

                                {isFreelancer && user.skills?.length > 0 && (
                                    <div className="pt-6 border-t border-gray-100">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Core Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.skills.map(skill => (
                                                <Badge key={skill} className="bg-indigo-50 text-indigo-700 px-4 py-2 border-none">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </TabsContent>

                        <TabsContent value="experience" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            {isFreelancer ? (
                                <>
                                    <Card className="p-8 border-none shadow-sm space-y-6">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                                            <h3 className="font-black uppercase text-sm tracking-widest">Education</h3>
                                        </div>
                                        <div className="space-y-6">
                                            {user.education?.map((edu, idx) => (
                                                <div key={idx} className="flex gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <GraduationCap className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                                                        <p className="text-sm text-gray-600 font-medium">{edu.stream}</p>
                                                        <p className="text-[10px] font-black text-indigo-500 uppercase mt-1">Class of {edu.yearCompleted}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!user.education || user.education.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">No education history available</p>
                                            )}
                                        </div>
                                    </Card>

                                    <Card className="p-8 border-none shadow-sm space-y-6">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-indigo-600" />
                                            <h3 className="font-black uppercase text-sm tracking-widest">Certifications</h3>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {user.certifications?.map((cert, idx) => (
                                                <div key={idx} className="p-4 border rounded-xl flex gap-3">
                                                    <Award className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900 leading-tight">{cert.name}</h4>
                                                        <p className="text-xs text-gray-500 font-medium mt-1">{cert.issuer}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!user.certifications || user.certifications.length === 0) && (
                                                <p className="text-sm text-gray-400 italic col-span-full">No certifications available</p>
                                            )}
                                        </div>
                                    </Card>
                                </>
                            ) : (
                                <Card className="p-8 border-none shadow-sm space-y-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        <h3 className="font-black uppercase text-sm tracking-widest">Company Reputation</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="text-2xl font-black text-gray-900 tracking-tight">{user.totalHires || 0}</div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Hires</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="text-2xl font-black text-gray-900 tracking-tight">{user.totalJobsPosted || 0}</div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Jobs Posted</div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="portfolio" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid md:grid-cols-2 gap-6">
                                {isFreelancer ? (
                                    user.portfolio?.map((item, idx) => (
                                        <Card key={idx} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                                {item.image ? (
                                                    <img src={getFullUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase className="w-10 h-10 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full py-10 text-center text-gray-400 italic">
                                        Client portfolio not available
                                    </div>
                                )}
                                {(isFreelancer && (!user.portfolio || user.portfolio.length === 0)) && (
                                    <p className="text-sm text-gray-400 italic col-span-full text-center py-10">No portfolio projects available</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
