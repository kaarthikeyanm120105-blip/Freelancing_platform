import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, Star } from 'lucide-react';
import { mockCourses } from '../../data/mockData';

export default function CourseManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Course Management</h2>
          <p className="text-gray-600">Manage learning resources for students</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.provider}</p>
                </div>
              </div>
              {course.recommended && (
                <Badge className="bg-green-100 text-green-700">Recommended</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{course.duration}</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {course.rating}
              </span>
              <Badge variant="outline">{course.level}</Badge>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Skills:</div>
              <div className="flex flex-wrap gap-2">
                {course.skillsGained.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}





