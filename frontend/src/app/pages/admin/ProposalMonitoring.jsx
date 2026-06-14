import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, User, Briefcase, Calendar } from 'lucide-react';

export default function ProposalMonitoring() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await adminService.getProposals();
                if (response.success) {
                    setProposals(response.proposals);
                }
            } catch (error) {
                toast.error('Failed to fetch proposals');
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl border-2 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Proposal Monitoring 📄</h2>
                    <p className="text-gray-500 font-medium italic">Monitor platform proposals for quality and spam</p>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-100 italic font-bold text-purple-700">
                    Total Proposals: {proposals.length}
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Scanning Proposals...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {proposals.length === 0 ? (
                        <div className="p-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-400 font-black uppercase text-sm tracking-tighter">No proposals found</p>
                        </div>
                    ) : (
                        proposals.map((proposal) => (
                            <Card key={proposal._id} className="p-6 border-2 hover:border-purple-100 transition-all group">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-2 rounded-lg">
                                                <FileText className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 uppercase tracking-tight">{proposal.jobId?.jobTitle || 'Deleted Job'}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold italic uppercase">
                                                    <User className="w-3 h-3" />
                                                    <span>From: {proposal.freelancerId?.fullName || 'Removed User'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                                            "{proposal.coverLetter}"
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                                <span className="text-xs font-black text-green-700 tracking-wider">BID: ₹{proposal.bidAmount?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                                <Calendar className="w-3 h-3 text-blue-600" />
                                                <span className="text-xs font-black text-blue-700 tracking-wider uppercase">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <Badge className={`uppercase text-[10px] font-black ${proposal.status === 'accepted' ? 'bg-green-500' :
                                                    proposal.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}>
                                                {proposal.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
