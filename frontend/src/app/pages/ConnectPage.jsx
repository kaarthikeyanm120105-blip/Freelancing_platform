import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search, MessageSquare, User, Briefcase, Building2, Star, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ConnectPage() {
    const [query, setQuery] = useState('');
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await userService.searchUsers(query, role);
            if (data.success) {
                setUsers(data.users.filter(u => u._id !== currentUser?._id));
            }
        } catch (error) {
            toast.error("Failed to search users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [role]);

    const handleMessage = async (targetId) => {
        try {
            // Since this is a direct connection, we don't have a jobId here 
            // In a real freelancing platform, you usually connect via a job
            // But for a 'Connect' feature, we can create a generic conversation if allowed
            const conversation = await chatService.createConversation(null, currentUser?._id, targetId);
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

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Connect</h2>
                    <p className="text-gray-500 font-medium">Find and connect with freelancers and clients across the platform</p>
                </div>
            </div>

            <Card className="p-6 border-none shadow-sm bg-white">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by name, skills, title or company..."
                            className="pl-11 h-12 border-gray-200"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <select 
                        className="h-12 px-4 rounded-md border border-gray-200 bg-white font-bold text-sm uppercase"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="freelancer">Freelancers</option>
                        <option value="client">Clients</option>
                    </select>
                    <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase tracking-wider">
                        Search
                    </Button>
                </form>
            </Card>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.length > 0 ? (
                        users.map((u) => (
                            <Card key={u._id} className="p-6 border-2 hover:border-indigo-300 transition-all group">
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="h-16 w-16 border-2 border-indigo-100 ring-2 ring-indigo-50">
                                        <AvatarImage src={getFullUrl(u.profileImage || u.companyLogo)} />
                                        <AvatarFallback className="bg-indigo-600 text-white font-bold text-xl">
                                            {u.fullName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate uppercase tracking-tight">{u.fullName}</h4>
                                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-0.5">
                                            {u.role === 'client' ? u.companyName || 'Client' : u.title || 'Freelancer'}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold text-gray-700">{u.rating || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {u.role === 'freelancer' ? (
                                        <div className="flex flex-wrap gap-1">
                                            {u.skills?.slice(0, 3).map(skill => (
                                                <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-2 font-bold uppercase tracking-tighter">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {u.skills?.length > 3 && <span className="text-[10px] text-gray-400 font-bold">+{u.skills.length - 3}</span>}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 line-clamp-2 italic">
                                            "{u.companyDescription || 'No description provided'}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/profile/${u._id}`} className="flex-1">
                                        <Button variant="outline" className="w-full font-bold uppercase text-xs border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                            <User className="w-3.5 h-3.5 mr-2" />
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button 
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold uppercase text-xs"
                                        onClick={() => handleMessage(u._id)}
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 mr-2" />
                                        Message
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-500 font-medium">No users found matching your search</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
