
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Image, FileText, Save, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTab, setSelectedTab] = useState('create');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Create New Post</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button>
            Publish Now
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Tabs 
            value={selectedTab} 
            onValueChange={setSelectedTab} 
            className="bg-white rounded-lg shadow-card"
          >
            <div className="border-b border-secondary-light">
              <TabsList className="bg-transparent p-0 h-12">
                <TabsTrigger 
                  value="create" 
                  className="flex-1 h-full border-r border-secondary-light data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                    Post Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-secondary mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none min-h-[300px] resize-y"
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    Add Image
                  </Button>
                  <Button variant="outline" size="sm">
                    # Add Tags
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="p-4">
              {title || content ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-secondary">{title || "Untitled Post"}</h2>
                  <div className="prose">
                    {content ? (
                      <p className="text-secondary">{content}</p>
                    ) : (
                      <p className="text-secondary/50 italic">No content yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-16 w-16 text-secondary/30 mb-4" />
                  <h3 className="text-lg font-medium text-secondary">Nothing to preview yet</h3>
                  <p className="text-secondary/70 mt-1">Add a title and content to see the preview</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right sidebar */}
        <div className="lg:w-80">
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <h3 className="font-medium text-secondary mb-4">Publishing Options</h3>
                <div className="space-y-4">
                  <div>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsScheduleOpen(!isScheduleOpen)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Post
                    </Button>
                  </div>
                  
                  {isScheduleOpen && (
                    <div className="p-3 bg-secondary-light rounded-md space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full px-3 py-2 rounded-md border border-secondary-light bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1">
                          Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            className="w-full px-3 py-2 rounded-md border border-secondary-light bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
                          />
                          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50 pointer-events-none" />
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        Confirm Schedule
                      </Button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary">
                      Platforms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="bg-[#1877F2] text-white border-0 hover:bg-[#1877F2]/90">
                        Facebook
                      </Button>
                      <Button variant="outline" size="sm" className="bg-[#1DA1F2] text-white border-0 hover:bg-[#1DA1F2]/90">
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm" className="bg-[#E4405F] text-white border-0 hover:bg-[#E4405F]/90">
                        Instagram
                      </Button>
                      <Button variant="outline" size="sm" className="bg-[#0A66C2] text-white border-0 hover:bg-[#0A66C2]/90">
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-secondary mb-2">Post Guidelines</h3>
                <ul className="text-sm space-y-2 text-secondary/70">
                  <li>• Keep titles under 60 characters</li>
                  <li>• Include at least one relevant image</li>
                  <li>• Use 2-5 hashtags maximum</li>
                  <li>• Best posting times: 9-11 AM, 1-3 PM</li>
                </ul>
              </div>
              
              <div className="p-4 bg-secondary-light/50">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80"
                  alt="Create post illustration"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
