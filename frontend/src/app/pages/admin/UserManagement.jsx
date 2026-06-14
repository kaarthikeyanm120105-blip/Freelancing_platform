import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, MoreVertical, Ban, CheckCircle, Trash2, UserX } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const response = await adminService.toggleBlockUser(id);
      if (response.success) {
        toast.success(response.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const response = await adminService.deleteUser(id);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const freelancers = filteredUsers.filter(u => u.role === 'freelancer');
  const clients = filteredUsers.filter(u => u.role === 'client');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">User Management</h2>
          <p className="text-gray-600">Manage students and clients on the platform</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading platform users...</p>
        </div>
      ) : (
        <Tabs defaultValue="freelancers">
          <TabsList>
            <TabsTrigger value="freelancers">
              Freelancers
              <Badge className="ml-2 bg-indigo-100 text-indigo-700 border-none">{freelancers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="clients">
              Clients
              <Badge className="ml-2 bg-purple-100 text-purple-700 border-none">{clients.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freelancers" className="space-y-4 mt-6">
            {freelancers.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-white rounded-xl border-2 border-dashed">No freelancers found.</div>
            ) : (
              freelancers.map((user) => (
                <Card key={user._id} className={`p-6 border-2 transition-all ${user.isBlocked ? 'bg-red-50/30 border-red-100 opacity-75' : 'hover:border-indigo-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          user.fullName[0]
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{user.fullName}</h3>
                          {user.isBlocked && <Badge variant="destructive" className="text-[10px] font-black uppercase">Blocked</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-bold italic uppercase tracking-wider">
                          <span>{user.isAccountVerified ? '✅ verified' : '❌ unverified'}</span>
                          <span>•</span>
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={user.isBlocked ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleBlock(user._id)}
                        className={user.isBlocked ? "border-green-200 text-green-700 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}
                      >
                        {user.isBlocked ? <CheckCircle className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                        {user.isBlocked ? 'Unblock' : 'Block User'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
              ))}
          </TabsContent>

          <TabsContent value="clients" className="space-y-4 mt-6">
            {clients.length === 0 ? (
              <div className="p-12 text-center text-gray-400 bg-white rounded-xl border-2 border-dashed">No clients found.</div>
            ) : (
              clients.map((user) => (
                <Card key={user._id} className={`p-6 border-2 transition-all ${user.isBlocked ? 'bg-red-50/30 border-red-100 opacity-75' : 'hover:border-purple-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                        {user.companyLogo ? (
                          <img src={user.companyLogo} alt="" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          user.fullName[0]
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{user.fullName} {user.companyName && <span className="text-gray-400 font-medium text-sm">(@{user.companyName})</span>}</h3>
                          {user.isBlocked && <Badge variant="destructive" className="text-[10px] font-black uppercase">Blocked</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{user.email}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-bold italic uppercase tracking-wider">
                          <span>Client Portal</span>
                          <span>•</span>
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={user.isBlocked ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleBlock(user._id)}
                        className={user.isBlocked ? "border-green-200 text-green-700 hover:bg-green-50" : "text-red-600 hover:bg-red-50"}
                      >
                        {user.isBlocked ? <CheckCircle className="w-4 h-4 mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
                        {user.isBlocked ? 'Unblock' : 'Block User'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
