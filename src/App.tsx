import { useState, useEffect, useRef, useCallback } from 'react'
import { blink } from './blink/client'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { 
  Upload, 
  Camera, 
  FileText, 
  Image as ImageIcon, 
  Download,
  Share2,
  Eye,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  Stamp,
  FileCheck
} from 'lucide-react'

interface TransmutationRecord {
  id: string
  caseNumber: string
  entityName: string
  originalDocument: string
  transmutedEntity: string
  submittedAt: string
  status: 'processing' | 'classified' | 'archived'
  classification: 'SAFE' | 'EUCLID' | 'KETER'
  operatorId: string
}

function App() {
  const [records, setRecords] = useState<TransmutationRecord[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [entityName, setEntityName] = useState('')
  const [showClassification, setShowClassification] = useState(false)
  const [latestRecord, setLatestRecord] = useState<TransmutationRecord | null>(null)
  const [currentView, setCurrentView] = useState<'portal' | 'archive' | 'entity'>('portal')
  const [selectedRecord, setSelectedRecord] = useState<TransmutationRecord | null>(null)
  const [processingStage, setProcessingStage] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const loadRecords = useCallback(() => {
    try {
      const storedRecords = localStorage.getItem('dept_transmutation_records')
      if (storedRecords) {
        const records = JSON.parse(storedRecords)
        setRecords(records)
      }
    } catch (error) {
      console.error('Failed to load transmutation records:', error)
    }
  }, [])

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    loadRecords()
  }, [loadRecords])

  const saveRecords = (newRecords: TransmutationRecord[]) => {
    try {
      localStorage.setItem('dept_transmutation_records', JSON.stringify(newRecords))
      setRecords(newRecords)
    } catch (error) {
      console.error('Failed to save transmutation records:', error)
    }
  }

  const generateCaseNumber = () => {
    const year = new Date().getFullYear()
    const sequence = String(records.length + 1).padStart(4, '0')
    return `DT-${year}-${sequence}`
  }

  const getRandomClassification = (): 'SAFE' | 'EUCLID' | 'KETER' => {
    const classifications = ['SAFE', 'EUCLID', 'KETER'] as const
    return classifications[Math.floor(Math.random() * classifications.length)]
  }

  const handleDocumentUpload = async (file: File) => {
    if (!file) return

    setIsProcessing(true)
    setProgress(10)
    setProcessingStage('DOCUMENT RECEIVED - INITIATING SCAN PROTOCOLS')

    try {
      // Upload original document
      setProgress(25)
      setProcessingStage('UPLOADING TO SECURE SERVERS')
      const { publicUrl: originalDocumentUrl } = await blink.storage.upload(
        file,
        `dept-transmutation/documents/${Date.now()}-${file.name}`,
        { upsert: true }
      )

      setProgress(40)
      setProcessingStage('ANALYZING DIMENSIONAL PROPERTIES')

      // Generate 3D entity using AI with the uploaded document
      setProgress(60)
      setProcessingStage('INITIATING TRANSMUTATION SEQUENCE')
      const { data } = await blink.ai.modifyImage({
        images: [originalDocumentUrl],
        prompt: `Transform this children's drawing into a highly detailed, official government-classified 3D entity. Create a professional, technical rendering suitable for official documentation. The entity should appear as a legitimate classified specimen with proper lighting, shadows, and a neutral background. Make it look like an official government photograph of a contained anomalous entity.`,
        size: '1024x1024',
        quality: 'high',
        n: 1
      })

      setProgress(80)
      setProcessingStage('FINALIZING CLASSIFICATION PROTOCOLS')

      // Create new transmutation record
      const finalName = entityName.trim() || `Entity-${records.length + 1}`
      const record: TransmutationRecord = {
        id: `dt_entity_${Date.now()}`,
        caseNumber: generateCaseNumber(),
        entityName: finalName,
        originalDocument: originalDocumentUrl,
        transmutedEntity: data[0].url,
        submittedAt: new Date().toISOString(),
        status: 'classified',
        classification: getRandomClassification(),
        operatorId: 'OP-7749'
      }

      // Save to localStorage
      const updatedRecords = [record, ...records]
      saveRecords(updatedRecords)

      setProgress(100)
      setProcessingStage('TRANSMUTATION COMPLETE - ENTITY CLASSIFIED')
      setLatestRecord(record)
      
      // Show classification results
      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
        setProcessingStage('')
        setShowClassification(true)
        setEntityName('')
      }, 1500)

    } catch (error) {
      console.error('Failed to process transmutation:', error)
      setIsProcessing(false)
      setProgress(0)
      setProcessingStage('ERROR - TRANSMUTATION FAILED')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleDocumentUpload(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Failed to start camera:', error)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    if (context) {
      context.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `dept-document-${Date.now()}.jpg`, { type: 'image/jpeg' })
          handleDocumentUpload(file)
          stopCamera()
        }
      }, 'image/jpeg', 0.8)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const shareEntity = async (record: TransmutationRecord) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${record.entityName} - Department of Transmutation`,
          text: `Classified Entity: ${record.caseNumber}`,
          url: record.transmutedEntity
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      await navigator.clipboard.writeText(record.transmutedEntity)
      alert('Entity image URL copied to clipboard!')
    }
  }

  const downloadEntity = (record: TransmutationRecord) => {
    const link = document.createElement('a')
    link.href = record.transmutedEntity
    link.download = `${record.caseNumber}-${record.entityName}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Department Portal (Main Page)
  if (currentView === 'portal') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Official Header */}
        <header className="bg-gray-800 text-white border-b-4 border-red-600">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold font-mono">DEPARTMENT OF TRANSMUTATION</h1>
                  <p className="text-sm text-gray-300 font-mono">DIMENSIONAL CONVERSION PROTOCOLS</p>
                </div>
              </div>
              {records.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('archive')}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Entity Archive ({records.length})
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Official Notice */}
          <div className="mb-8">
            <Card className="border-l-4 border-l-red-600 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red-800 mb-1">CLASSIFIED OPERATION</h3>
                    <p className="text-sm text-red-700">
                      This system is authorized for dimensional transmutation protocols only. 
                      All activities are monitored and logged. Unauthorized access is prohibited.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <strong>Established:</strong> 1952
                  </div>
                  <div>
                    <strong>Primary Function:</strong> Dimensional entity transmutation and classification
                  </div>
                  <div>
                    <strong>Security Clearance:</strong> Level 4 Required
                  </div>
                  <div>
                    <strong>Current Operations:</strong> {records.length} Active Cases
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Classification System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">SAFE</Badge>
                    <span className="text-sm">Minimal containment required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">EUCLID</Badge>
                    <span className="text-sm">Moderate containment protocols</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">KETER</Badge>
                    <span className="text-sm">Maximum security required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transmutation Interface */}
          {isProcessing ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <Clock className="h-5 w-5 animate-spin" />
                  TRANSMUTATION IN PROGRESS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-black text-green-400 p-4 rounded font-mono text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      SYSTEM STATUS: ACTIVE
                    </div>
                    <div>{processingStage}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <CardHeader>
                  <CardTitle className="text-center font-mono">
                    DOCUMENT SUBMISSION PORTAL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-4">Submit Document for Transmutation</h3>
                  <p className="text-gray-600 mb-6">
                    Upload source material for dimensional conversion processing
                  </p>
                  
                  {/* Entity designation input */}
                  <div className="mb-6">
                    <Input
                      placeholder="Entity Designation (Optional)"
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      className="text-center font-mono"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-800 hover:bg-gray-700"
                      size="lg"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      INITIATE TRANSMUTATION PROTOCOL
                    </Button>
                    
                    {isMobile && (
                      <Button 
                        onClick={startCamera}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        CAPTURE DOCUMENT
                      </Button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <p className="text-xs text-gray-500 mt-4 font-mono">
                    SECURITY NOTICE: All submissions are automatically classified and archived
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Transmutations */}
          {records.length > 0 && !isProcessing && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 font-mono">RECENT TRANSMUTATIONS</h2>
                <p className="text-gray-600">Latest dimensional conversion operations</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {records.slice(0, 3).map((record) => (
                  <Card 
                    key={record.id} 
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedRecord(record)
                      setCurrentView('entity')
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={record.transmutedEntity}
                        alt={record.entityName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${record.classification === 'SAFE' ? 'bg-green-100 text-green-800' : ''}
                            ${record.classification === 'EUCLID' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${record.classification === 'KETER' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {record.classification}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold font-mono text-sm mb-1">{record.caseNumber}</h3>
                      <p className="text-sm text-gray-600 mb-2">{record.entityName}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {new Date(record.submittedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('archive')}
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Access Full Archive
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 max-w-md w-full">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold font-mono">DOCUMENT CAPTURE</h3>
                <p className="text-sm text-gray-600">Position document within frame</p>
              </div>
              
              <div className="relative mb-4 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={capturePhoto} className="flex-1 bg-gray-800 hover:bg-gray-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Classification Results Modal */}
        {showClassification && latestRecord && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <h2 className="text-2xl font-bold font-mono">TRANSMUTATION COMPLETE</h2>
                </div>
                <p className="text-gray-600">Entity successfully classified and archived</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Original document */}
                <div>
                  <h3 className="font-bold mb-4 text-center font-mono">SOURCE DOCUMENT</h3>
                  <div className="aspect-square rounded-lg overflow-hidden border-2">
                    <img
                      src={latestRecord.originalDocument}
                      alt="Source document"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Transmuted entity */}
                <div>
                  <h3 className="font-bold mb-4 text-center font-mono">CLASSIFIED ENTITY</h3>
                  <div className="aspect-square rounded-lg overflow-hidden border-2">
                    <img
                      src={latestRecord.transmutedEntity}
                      alt={latestRecord.entityName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Classification Details */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono">
                    <Stamp className="h-5 w-5" />
                    OFFICIAL CLASSIFICATION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Case Number:</strong> {latestRecord.caseNumber}
                    </div>
                    <div>
                      <strong>Entity Name:</strong> {latestRecord.entityName}
                    </div>
                    <div>
                      <strong>Classification:</strong> 
                      <Badge 
                        className={`ml-2 ${
                          latestRecord.classification === 'SAFE' ? 'bg-green-100 text-green-800' : 
                          latestRecord.classification === 'EUCLID' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {latestRecord.classification}
                      </Badge>
                    </div>
                    <div>
                      <strong>Operator ID:</strong> {latestRecord.operatorId}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Action buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => shareEntity(latestRecord)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => downloadEntity(latestRecord)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button 
                  onClick={() => {
                    setShowClassification(false)
                    setLatestRecord(null)
                  }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700"
                >
                  <FileCheck className="h-4 w-4" />
                  New Case
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowClassification(false)
                    setLatestRecord(null)
                    setCurrentView('archive')
                  }}
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  View Archive
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    )
  }

  // Entity Archive View
  if (currentView === 'archive') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-800 text-white border-b-4 border-red-600">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentView('portal')}
                  className="p-0 text-white hover:text-gray-300"
                >
                  <Shield className="h-8 w-8 text-red-500 mr-2" />
                  <div className="text-left">
                    <div className="text-xl font-bold font-mono">DEPARTMENT OF TRANSMUTATION</div>
                    <div className="text-sm text-gray-300 font-mono">ENTITY ARCHIVE</div>
                  </div>
                </Button>
              </div>
              <Button 
                onClick={() => setCurrentView('portal')}
                className="bg-red-600 hover:bg-red-700"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                New Transmutation
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 font-mono">CLASSIFIED ENTITY ARCHIVE</h1>
            <p className="text-gray-600">
              {records.length} classified entit{records.length !== 1 ? 'ies' : 'y'} on file
            </p>
          </div>

          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <Card 
                  key={record.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedRecord(record)
                    setCurrentView('entity')
                  }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={record.transmutedEntity}
                      alt={record.entityName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        className={`
                          ${record.classification === 'SAFE' ? 'bg-green-100 text-green-800' : ''}
                          ${record.classification === 'EUCLID' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${record.classification === 'KETER' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {record.classification}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white font-mono text-xs">
                        {record.caseNumber}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 font-mono">{record.entityName}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Classified: {new Date(record.submittedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(record.originalDocument, '_blank')
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Source
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gray-800 hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareEntity(record)
                        }}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 font-mono">NO ENTITIES ON FILE</h3>
              <p className="text-gray-600 mb-6">
                No transmutation records found in the archive
              </p>
              <Button 
                onClick={() => setCurrentView('portal')}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Begin First Transmutation
              </Button>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Individual Entity View
  if (currentView === 'entity' && selectedRecord) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-800 text-white border-b-4 border-red-600">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentView('archive')}
                  className="p-0 text-white hover:text-gray-300"
                >
                  <Shield className="h-8 w-8 text-red-500 mr-2" />
                  <div className="text-left">
                    <div className="text-xl font-bold font-mono">DEPARTMENT OF TRANSMUTATION</div>
                    <div className="text-sm text-gray-300 font-mono">ENTITY FILE: {selectedRecord.caseNumber}</div>
                  </div>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentView('archive')} className="border-gray-600 text-white hover:bg-gray-700">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button onClick={() => setCurrentView('portal')} className="bg-red-600 hover:bg-red-700">
                  <FileCheck className="h-4 w-4 mr-2" />
                  New Case
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 font-mono">{selectedRecord.entityName}</h1>
            <p className="text-gray-600 font-mono">
              Case {selectedRecord.caseNumber} • Classified {new Date(selectedRecord.submittedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Original document */}
            <div>
              <h3 className="font-bold mb-4 text-center font-mono">SOURCE DOCUMENT</h3>
              <div className="aspect-square rounded-lg overflow-hidden border-2">
                <img
                  src={selectedRecord.originalDocument}
                  alt="Source document"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Transmuted entity */}
            <div>
              <h3 className="font-bold mb-4 text-center font-mono">CLASSIFIED ENTITY</h3>
              <div className="aspect-square rounded-lg overflow-hidden border-2">
                <img
                  src={selectedRecord.transmutedEntity}
                  alt={selectedRecord.entityName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Official Classification */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Stamp className="h-5 w-5" />
                OFFICIAL CLASSIFICATION RECORD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold mb-2 font-mono">ENTITY DETAILS</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Case Number:</strong> {selectedRecord.caseNumber}</div>
                    <div><strong>Entity Name:</strong> {selectedRecord.entityName}</div>
                    <div><strong>Status:</strong> {selectedRecord.status.toUpperCase()}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2 font-mono">CLASSIFICATION</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Level:</strong> 
                      <Badge 
                        className={`ml-2 ${
                          selectedRecord.classification === 'SAFE' ? 'bg-green-100 text-green-800' : 
                          selectedRecord.classification === 'EUCLID' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedRecord.classification}
                      </Badge>
                    </div>
                    <div><strong>Operator:</strong> {selectedRecord.operatorId}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2 font-mono">TIMESTAMPS</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Submitted:</strong> {new Date(selectedRecord.submittedAt).toLocaleString()}</div>
                    <div><strong>Processed:</strong> {new Date(selectedRecord.submittedAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline"
              onClick={() => shareEntity(selectedRecord)}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Entity
            </Button>
            <Button 
              variant="outline"
              onClick={() => downloadEntity(selectedRecord)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(selectedRecord.originalDocument, '_blank')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Source
            </Button>
            <Button 
              onClick={() => setCurrentView('portal')}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700"
            >
              <FileCheck className="h-4 w-4" />
              New Case
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return null
}

export default App