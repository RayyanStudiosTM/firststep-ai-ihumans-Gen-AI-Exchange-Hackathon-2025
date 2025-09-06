"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Star,
  BookOpen,
  Trophy,
  Code,
  Briefcase,
  GraduationCap,
  Target,
  ArrowRight,
  Building2,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Clock,
  Award,
  Heart,
  Sparkles,
  Loader2,
  XCircle,
  AlertCircle,
  Download,
  FileText
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  getRecommendations,
  getRoadmap,
} from "@/utils/firebase/recommendations/read";
import { getUserAssessment } from "@/utils/firebase/assessment/read";
import toast from "react-hot-toast";

// Reusable Components
const MatchScoreBadge = ({ score }) => (
  <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full">
    <Star className="w-5 h-5 fill-violet-500 text-violet-500" />
    <span className="font-semibold">{score}% Match</span>
  </div>
);

const StatsCard = ({ icon: Icon, label, value, prefix }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-violet-50 rounded-lg">
        <Icon className="w-5 h-5 text-violet-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">
          {prefix}
          {value}
        </p>
      </div>
    </div>
  </div>
);

const TimelineItem = ({ year, data, isLast }) => (
  <div className="relative">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
        <Trophy className="w-6 h-6 text-violet-600" />
      </div>
      <div>
        <p className="text-sm text-violet-600 font-medium">Year {year}</p>
        <h3 className="text-lg font-semibold text-gray-900">{data.role}</h3>
        <p className="text-gray-600">{data.focus}</p>
        <p className="text-sm font-medium text-violet-600 mt-1">
          {data.expectedPackage}
        </p>
      </div>
    </div>
    {!isLast && (
      <div className="absolute left-6 top-12 bottom-0 w-[1px] bg-violet-100" />
    )}
  </div>
);

const AccordionItem = ({ title, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-50 rounded-lg">
            <Icon className="w-5 h-5 text-violet-600" />
          </div>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

const SkillCard = ({ skill, technologies, proficiencyLevel }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200">
    <h4 className="font-medium text-gray-900 mb-2">{skill}</h4>
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-violet-50 text-violet-600 text-sm rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Proficiency:{" "}
        <span className="text-violet-600 font-medium">{proficiencyLevel}</span>
      </p>
    </div>
  </div>
);

const CourseCard = ({ course }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-violet-200 transition-all group relative">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{course.name}</h4>
        <p className="text-sm text-gray-500">{course.platform}</p>
      </div>
      {course.certification && (
        <div className="p-1 bg-green-50 rounded">
          <Award className="w-4 h-4 text-green-600" />
        </div>
      )}
    </div>

    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>{course.duration}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <DollarSign className="w-4 h-4" />
        <span>{course.cost}</span>
      </div>
    </div>

    {course.link && (
      <a
        href={course.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-between p-2 bg-violet-50 rounded-lg text-violet-600 hover:bg-violet-100 transition-colors group-hover:bg-violet-100"
      >
        <span className="text-sm font-medium">View Course</span>
        <div className="flex items-center gap-1">
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {course.platform}
          </span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    )}

    <div className="absolute inset-0 bg-violet-50 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity pointer-events-none" />
  </div>
);

const SafeList = ({ items = [], render }) => {
  if (!items || !Array.isArray(items)) return null;
  return items.map(render);
};

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Loader2 className="w-8 h-8 text-violet-600 animate-spin mx-auto" />
      <p className="text-gray-600">Loading career roadmap...</p>
    </div>
  </div>
);

// PDF-Optimized Content Component
const PDFContent = ({ career, additionalInsights, user }) => (
  <div 
    className="pdf-content" 
    style={{ 
      width: '210mm', 
      margin: '0 auto', 
      backgroundColor: 'white', 
      padding: '20px', 
      fontSize: '12px', 
      lineHeight: '1.4', 
      color: '#333',
      fontFamily: 'Arial, sans-serif'
    }}
  >
    {/* PDF Header */}
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '30px', 
      borderBottom: '2px solid #8b5cf6', 
      paddingBottom: '20px' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '15px', 
        marginBottom: '15px' 
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          📄
        </div>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            Career Roadmap Report
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: '5px 0 0 0' 
          }}>
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '15px', 
        borderRadius: '8px' 
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: '0 0 8px 0', 
          color: '#1f2937' 
        }}>
          {user?.displayName}'s Career Path
        </h2>
        <p style={{ 
          color: '#6b7280', 
          margin: '0' 
        }}>
          Personalized roadmap for {career?.career || "career development"}
        </p>
      </div>
    </div>

    {/* Career Overview */}
    <div style={{ marginBottom: '25px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '15px', 
        borderBottom: '1px solid #e5e7eb', 
        paddingBottom: '8px' 
      }}>
        Career Overview
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '15px' 
      }}>
        {career?.industryOutlook && (
          <>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              <p style={{ 
                fontSize: '11px', 
                color: '#6b7280', 
                margin: '0 0 5px 0' 
              }}>
                Industry Growth
              </p>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1f2937', 
                margin: '0' 
              }}>
                {career.industryOutlook.growthRate || "N/A"}
              </p>
            </div>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              <p style={{ 
                fontSize: '11px', 
                color: '#6b7280', 
                margin: '0 0 5px 0' 
              }}>
                Market Demand
              </p>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1f2937', 
                margin: '0' 
              }}>
                {career.industryOutlook.marketDemand || "N/A"}
              </p>
            </div>
            <div style={{ 
              border: '1px solid #e5e7eb', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              <p style={{ 
                fontSize: '11px', 
                color: '#6b7280', 
                margin: '0 0 5px 0' 
              }}>
                Top Package
              </p>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1f2937', 
                margin: '0' 
              }}>
                {career.industryOutlook.topRecruiters?.[0]?.averagePackage || "N/A"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Career Progression */}
    {additionalInsights?.careerProgression && (
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '15px', 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '8px' 
        }}>
          Career Progression Timeline
        </h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px' 
        }}>
          {Object.entries(additionalInsights.careerProgression).map(([year, data], index) => (
            <div key={year} style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px' 
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#8b5cf6', 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '18px', 
                flexShrink: 0 
              }}>
                🏆
              </div>
              <div>
                <p style={{ 
                  fontSize: '11px', 
                  color: '#8b5cf6', 
                  fontWeight: '600', 
                  margin: '0 0 4px 0' 
                }}>
                  Year {year.replace("year", "")}
                </p>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  margin: '0 0 4px 0' 
                }}>
                  {data.role}
                </h3>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#6b7280', 
                  margin: '0 0 4px 0' 
                }}>
                  {data.focus}
                </p>
                <p style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#8b5cf6', 
                  margin: '0' 
                }}>
                  {data.expectedPackage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Required Skills */}
    {career?.subFields && (
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '15px', 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '8px' 
        }}>
          Required Skills
        </h2>
        {career.subFields.map((subField, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#8b5cf6', 
              marginBottom: '8px' 
            }}>
              🎯 {subField.name}
            </h3>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginBottom: '12px' 
            }}>
              {subField.description}
            </p>
            
            {/* Technical Skills */}
            {subField.requiredSkills?.technical?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '8px' 
                }}>
                  Technical Skills:
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '8px' 
                }}>
                  {subField.requiredSkills.technical.map((skill, skillIdx) => (
                    <div key={skillIdx} style={{ 
                      border: '1px solid #e5e7eb', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      backgroundColor: 'white' 
                    }}>
                      <h5 style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        margin: '0 0 4px 0' 
                      }}>
                        {skill.skill}
                      </h5>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px', 
                        marginBottom: '4px' 
                      }}>
                        {skill.technologies?.map((tech, techIdx) => (
                          <span key={techIdx} style={{ 
                            fontSize: '10px', 
                            backgroundColor: '#f3f4f6', 
                            color: '#8b5cf6', 
                            padding: '2px 6px', 
                            borderRadius: '12px' 
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p style={{ 
                        fontSize: '10px', 
                        color: '#6b7280', 
                        margin: '0' 
                      }}>
                        Proficiency: <span style={{ 
                          color: '#8b5cf6', 
                          fontWeight: '600' 
                        }}>
                          {skill.proficiencyLevel}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {subField.requiredSkills?.soft?.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '6px' 
                }}>
                  Soft Skills:
                </h4>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '6px' 
                }}>
                  {subField.requiredSkills.soft.map((skill, skillIdx) => (
                    <span key={skillIdx} style={{ 
                      fontSize: '10px', 
                      backgroundColor: '#f3f4f6', 
                      color: '#8b5cf6', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      border: '1px solid #e5e7eb' 
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Recommended Courses */}
    {career?.subFields && (
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '15px', 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '8px' 
        }}>
          Recommended Learning Resources
        </h2>
        {career.subFields.map((subField, subFieldIdx) => (
          <div key={subFieldIdx} style={{ marginBottom: '15px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#8b5cf6', 
              marginBottom: '10px' 
            }}>
              📚 {subField.name}
            </h3>
            {subField.preparationResources?.courses?.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '10px' 
              }}>
                {subField.preparationResources.courses.map((course, courseIdx) => (
                  <div key={courseIdx} style={{ 
                    border: '1px solid #e5e7eb', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    backgroundColor: 'white' 
                  }}>
                    <h4 style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#1f2937', 
                      margin: '0 0 4px 0' 
                    }}>
                      {course.name}
                    </h4>
                    <p style={{ 
                      fontSize: '10px', 
                      color: '#6b7280', 
                      margin: '0 0 6px 0' 
                    }}>
                      {course.platform}
                    </p>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#6b7280' 
                    }}>
                      <p style={{ margin: '0 0 2px 0' }}>⏰ {course.duration}</p>
                      <p style={{ margin: '0 0 2px 0' }}>💰 {course.cost}</p>
                      {course.certification && <p style={{ margin: '0', color: '#10b981' }}>🏆 Certification Available</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Work-Life Balance */}
    {additionalInsights?.workLifeBalance && (
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '15px', 
          borderBottom: '1px solid #e5e7eb', 
          paddingBottom: '8px' 
        }}>
          Work-Life Balance
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px', 
          marginBottom: '12px' 
        }}>
          <div style={{ 
            border: '1px solid #e5e7eb', 
            padding: '12px', 
            borderRadius: '8px' 
          }}>
            <p style={{ 
              fontSize: '11px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              Working Hours
            </p>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0' 
            }}>
              {additionalInsights.workLifeBalance.averageWorkHours}
            </p>
          </div>
          <div style={{ 
            border: '1px solid #e5e7eb', 
            padding: '12px', 
            borderRadius: '8px' 
          }}>
            <p style={{ 
              fontSize: '11px', 
              color: '#6b7280', 
              margin: '0 0 4px 0' 
            }}>
              Remote Work
            </p>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1f2937', 
              margin: '0' 
            }}>
              {additionalInsights.workLifeBalance.remoteOpportunities}
            </p>
          </div>
        </div>
        {additionalInsights.workLifeBalance.tips?.length > 0 && (
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '12px', 
            borderRadius: '8px' 
          }}>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '8px' 
            }}>
              Pro Tips:
            </h4>
            <ul style={{ 
              margin: '0', 
              paddingLeft: '16px' 
            }}>
              {additionalInsights.workLifeBalance.tips.map((tip, idx) => (
                <li key={idx} style={{ 
                  fontSize: '11px', 
                  color: '#6b7280', 
                  marginBottom: '4px' 
                }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    {/* PDF Footer */}
    <div style={{ 
      textAlign: 'center', 
      marginTop: '30px', 
      paddingTop: '20px', 
      borderTop: '2px solid #8b5cf6', 
      color: '#6b7280' 
    }}>
      <p style={{ 
        fontSize: '11px', 
        margin: '0 0 4px 0' 
      }}>
        Generated by FirstStep AI - Career Guidance Platform
      </p>
      <p style={{ 
        fontSize: '10px', 
        margin: '0' 
      }}>
        For more personalized guidance, visit our platform
      </p>
    </div>
  </div>
);

// Main Component
const Roadmap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);

  const user = useSelector((state) => state.user);
  const roadmapRef = useRef();

  useEffect(() => {
    (async () => {
      if (!user?.uid) return;
      
      setIsLoading(true);
      try {
        const res = await getRoadmap({ uid: user.uid });
        setRoadmapData(res?.career_recommendations || res);
      } catch (error) {
        console.log('error', error);
        toast.error(String(error));
        setError("Roadmap is not generated. Please generate roadmap from assessment.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  // Enhanced PDF Export Function with Clean Layout
  const exportRoadmapPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Create a temporary container with clean PDF content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      document.body.appendChild(tempDiv);

      // Render PDF content
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempDiv);
      
      root.render(
        <PDFContent 
          career={roadmapData.primaryCareerPaths[0]} 
          additionalInsights={roadmapData.additionalInsights} 
          user={user} 
        />
      );

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 1000));

      const loadingToast = toast.loading('Generating PDF...');

      const canvas = await html2canvas(tempDiv.firstChild, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels (210mm)
        height: tempDiv.firstChild.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Handle multiple pages
      if (pdfHeight > 297) { // A4 height in mm
        const pageHeight = 297;
        let heightCovered = 0;
        let pageNumber = 1;
        
        while (heightCovered < pdfHeight) {
          if (pageNumber > 1) {
            pdf.addPage();
          }
          
          pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            -heightCovered * (297 / pdfHeight), 
            pdfWidth, 
            297
          );
          
          heightCovered += pageHeight;
          pageNumber++;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const fileName = `${user?.displayName || 'User'}_Career_Roadmap_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);
      
      toast.dismiss(loadingToast);
      toast.success('Career roadmap exported successfully!');
      
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Failed to export PDF. Please install: npm install jspdf html2canvas react-dom');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!roadmapData || !roadmapData?.primaryCareerPaths?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto" />
          <p className="text-gray-600">
            No recommendations available. Please complete the assessment first.
          </p>
        </div>
      </div>
    );
  }

  const career = roadmapData.primaryCareerPaths[0];
  const { additionalInsights } = roadmapData;

  return (
    <div className="space-y-8">
      {/* Header with Export Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Roadmap 📍</h1>
          <p className="text-gray-600">
            Your personalized path to success in {career?.career || "your field"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {career?.matchScore && <MatchScoreBadge score={career.matchScore} />}
          
          {/* Export PDF Button */}
          <button
            onClick={exportRoadmapPDF}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {career?.industryOutlook && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={TrendingUp}
            label="Industry Growth"
            value={career.industryOutlook.growthRate || "N/A"}
          />
          <StatsCard
            icon={Building2}
            label="Market Demand"
            value={career.industryOutlook.marketDemand || "N/A"}
          />
          <StatsCard
            icon={DollarSign}
            label="Top Package"
            value={
              career.industryOutlook.topRecruiters?.[0]?.averagePackage || "N/A"
            }
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Career Path */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progression Timeline */}
          {additionalInsights?.careerProgression && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Career Progression
              </h2>
              <div className="space-y-8">
                {Object.entries(additionalInsights.careerProgression).map(
                  ([year, data], index, arr) => (
                    <TimelineItem
                      key={year}
                      year={year.replace("year", "")}
                      data={data}
                      isLast={index === arr.length - 1}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* Required Skills Section */}
          {career?.subFields && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Required Skills
              </h2>
              <div className="space-y-6">
                {career.subFields.map((subField, idx) => (
                  <div key={idx} className="space-y-4">
                    <h3 className="text-md font-medium text-violet-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {subField.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {subField.description}
                    </p>

                    {/* Technical Skills */}
                    {subField.requiredSkills?.technical?.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SafeList
                          items={subField.requiredSkills.technical}
                          render={(skill, skillIdx) => (
                            <SkillCard key={skillIdx} {...skill} />
                          )}
                        />
                      </div>
                    )}

                    {/* Soft Skills */}
                    {subField.requiredSkills?.soft?.length > 0 && (
                      <div className="bg-violet-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-violet-900 mb-2">
                          Soft Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <SafeList
                            items={subField.requiredSkills.soft}
                            render={(skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="px-3 py-1 bg-violet-100 text-violet-600 text-sm rounded-full"
                              >
                                {skill}
                              </span>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Current Trends */}
                    {subField.currentTrends?.length > 0 && (
                      <div className="bg-violet-50/50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-violet-900 mb-2">
                          Current Trends
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <SafeList
                            items={subField.currentTrends}
                            render={(trend, trendIdx) => (
                              <span
                                key={trendIdx}
                                className="px-3 py-1 bg-white text-violet-600 text-sm rounded-full border border-violet-100"
                              >
                                {trend}
                              </span>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Resources Section */}
          {career?.subFields && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recommended Courses
                </h2>
                <div className="text-sm text-violet-600">
                  {career.subFields.reduce(
                    (total, subField) =>
                      total +
                      (subField.preparationResources?.courses?.length || 0),
                    0
                  )}{" "}
                  courses available
                </div>
              </div>

              {career.subFields.map((subField, subFieldIdx) => (
                <div key={subFieldIdx} className="space-y-4">
                  <h3 className="text-md font-medium text-violet-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {subField.name}
                  </h3>
                  {subField.preparationResources?.courses?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SafeList
                        items={subField.preparationResources.courses}
                        render={(course, courseIdx) => (
                          <CourseCard
                            key={`${subFieldIdx}-${courseIdx}`}
                            course={course}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-4">
          {/* Industry Info */}
          {career?.industryOutlook && (
            <AccordionItem title="Industry Outlook" icon={Target}>
              <div className="space-y-4">
                <p className="text-gray-600">
                  {career.industryOutlook.futureProspects}
                </p>
                {career.industryOutlook.topRecruiters?.length > 0 && (
                  <div className="space-y-4">
                    <SafeList
                      items={career.industryOutlook.topRecruiters}
                      render={(recruiter, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <h4 className="font-medium text-gray-900 mb-2">
                            {recruiter.type}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <SafeList
                                items={recruiter.companies}
                                render={(company, idx) => (
                                  <span
                                    key={idx}
                                    className="text-sm text-gray-600"
                                  >
                                    {company}
                                  </span>
                                )}
                              />
                            </div>
                            <p className="text-sm text-violet-600 font-medium">
                              {recruiter.averagePackage}
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </AccordionItem>
          )}

          {/* Work-Life Balance */}
          {additionalInsights?.workLifeBalance && (
            <AccordionItem title="Work-Life Balance" icon={Heart}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Working Hours</p>
                    <p className="font-medium text-gray-900">
                      {additionalInsights.workLifeBalance.averageWorkHours}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Remote Work</p>
                    <p className="font-medium text-gray-900">
                      {additionalInsights.workLifeBalance.remoteOpportunities}
                    </p>
                  </div>
                </div>
                {additionalInsights.workLifeBalance.tips?.length > 0 && (
                  <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-medium text-violet-900 mb-2">Pro Tips</h4>
                    <ul className="space-y-2">
                      <SafeList
                        items={additionalInsights.workLifeBalance.tips}
                        render={(tip, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-violet-700"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>{tip}</span>
                          </li>
                        )}
                      />
                    </ul>
                  </div>
                )}
              </div>
            </AccordionItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
