import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface GenerateReportProps {
  onBack: () => void;
}

export default function GenerateReport({ onBack }: GenerateReportProps) {
  const [reportType, setReportType] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeCharts, setIncludeCharts] = useState(true);

  const generatePDF = () => {
    if (!reportType || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('ChamaPlus Financial Report', 14, 20);

    // Report details
    doc.setFontSize(10);
    doc.text(
      `Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`,
      14,
      30
    );
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 35);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);

    // Summary section
    doc.setFontSize(14);
    doc.text('Financial Summary', 14, 50);
    doc.setFontSize(10);

    const summaryData = [
      ['Total Contributions', 'KSh 2,450,000'],
      ['Total Expenses', 'KSh 450,000'],
      ['Net Balance', 'KSh 2,000,000'],
      ['Active Members', '24'],
      ['Average Contribution', 'KSh 5,000'],
    ];

    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [47, 124, 247] },
    });

    // Member contributions table
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text('Member Contributions', 14, finalY + 10);

    const memberData = [
      ['Mary Wanjiku', 'KSh 75,000', 'Paid', '12 months'],
      ['Peter Kamau', 'KSh 120,000', 'Paid', '12 months'],
      ['Grace Achieng', 'KSh 85,000', 'Paid', '12 months'],
      ['David Omondi', 'KSh 95,000', 'Pending', '11 months'],
      ['Faith Njeri', 'KSh 68,000', 'Paid', '12 months'],
    ];

    autoTable(doc, {
      startY: finalY + 15,
      head: [['Member Name', 'Total Contribution', 'Status', 'Months Active']],
      body: memberData,
      theme: 'striped',
      headStyles: { fillColor: [47, 124, 247] },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        'ChamaPlus - Tumaini Chama',
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Save the PDF
    doc.save(
      `ChamaPlus-Report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`
    );
    toast.success('PDF report generated and downloaded successfully!');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Report generated successfully!');
  };

  const reportTypes = [
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'Total contributions, expenses, and current balance',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary',
    },
    {
      id: 'members',
      title: 'Member Activity',
      description: 'Individual member contributions and attendance',
      icon: <Users className="w-6 h-6" />,
      color: 'secondary',
    },
    {
      id: 'trends',
      title: 'Trends & Analytics',
      description: 'Growth patterns and performance metrics',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'accent',
    },
    {
      id: 'compliance',
      title: 'Compliance Report',
      description: 'Payment status and rule adherence',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'primary',
    },
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Financial Summary - Q4 2025',
      type: 'Financial',
      date: 'Jan 5, 2026',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Member Activity - December 2025',
      type: 'Members',
      date: 'Jan 1, 2026',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Year End Report 2025',
      type: 'Financial',
      date: 'Dec 31, 2025',
      size: '3.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Generate Report</h1>
          <p className="text-sm text-muted-foreground">
            Create detailed reports for your Chama
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Report Type</CardTitle>
              <CardDescription>
                Choose the type of report you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      reportType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-${type.color}/10 flex items-center justify-center flex-shrink-0`}
                      >
                        {type.icon}
                      </div>
                      <div>
                        <p className="font-medium">{type.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Set the date range and options</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        id="startDate"
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm">
                      End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        id="endDate"
                        type="date"
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Date Ranges */}
                <div className="space-y-2">
                  <label className="text-sm">Quick Select</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 1);
                        setStartDate(start.toISOString().split('T')[0]);
                        setEndDate(end.toISOString().split('T')[0]);
                      }}
                    >
                      Last Month
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setMonth(start.getMonth() - 3);
                        setStartDate(start.toISOString().split('T')[0]);
                        setEndDate(end.toISOString().split('T')[0]);
                      }}
                    >
                      Last 3 Months
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const end = new Date();
                        const start = new Date(end.getFullYear(), 0, 1);
                        setStartDate(start.toISOString().split('T')[0]);
                        setEndDate(end.toISOString().split('T')[0]);
                      }}
                    >
                      Year to Date
                    </Button>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Report Options</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      checked={includeCharts}
                      onChange={e => setIncludeCharts(e.target.checked)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="includeCharts" className="text-sm">
                      Include charts and graphs
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="includeSummary"
                      defaultChecked
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="includeSummary" className="text-sm">
                      Include executive summary
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="includeMembers"
                      defaultChecked
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="includeMembers" className="text-sm">
                      Include member breakdown
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={!reportType}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!reportType}
                    onClick={generatePDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download as PDF
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Automated Calculations</p>
                  <p className="text-xs text-muted-foreground">
                    All totals and percentages computed automatically
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Visual Charts</p>
                  <p className="text-xs text-muted-foreground">
                    Easy-to-understand graphs and visualizations
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Export Options</p>
                  <p className="text-xs text-muted-foreground">
                    Download as PDF or Excel format
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Member Access</p>
                  <p className="text-xs text-muted-foreground">
                    Share reports with all members easily
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Reports Generated
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Report</p>
                <p className="text-lg font-bold">Jan 5, 2026</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map(report => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.title}</p>
                    <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <Badge variant="outline" className="ml-2">
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
