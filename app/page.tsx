"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Plus, BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react"

import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

  if (missingKeys.length > 0) {
    console.error(
      "Missing Firebase environment variables:",
      missingKeys.map((key) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`),
    )
    return false
  }
  return true
}

let app: any = null
let db: any = null

// Initialize Firebase only if config is valid
if (validateFirebaseConfig()) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
} else {
  console.error("Firebase configuration is invalid. Please check your environment variables.")
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; title: string; description?: string; variant?: "default" | "destructive" }>
  >([])

  const toast = ({
    title,
    description,
    variant = "default",
  }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { toast, toasts }
}

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}: {
  children: any
  onClick?: () => void
  type?: "button" | "submit"
  variant?: "default" | "outline"
  size?: "default" | "sm"
  className?: string
  disabled?: boolean
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }: { children: any; className?: string }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}>{children}</div>
)

const CardHeader = ({ children, className = "" }: { children: any; className?: string }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
)

const CardTitle = ({ children, className = "" }: { children: any; className?: string }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>
)

const CardDescription = ({ children, className = "" }: { children: any; className?: string }) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
)

const CardContent = ({ children, className = "" }: { children: any; className?: string }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
)

const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
)

const Label = ({ children, htmlFor, className = "" }: { children: any; htmlFor?: string; className?: string }) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
  >
    {children}
  </label>
)

const Textarea = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
)

const Badge = ({
  children,
  className = "",
  variant = "default",
}: { children: any; className?: string; variant?: "default" | "secondary" }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}

const Checkbox = ({
  checked,
  onCheckedChange,
  id,
}: { checked: boolean; onCheckedChange: (checked: boolean) => void; id?: string }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
  />
)

const Select = ({
  children,
  value,
  onValueChange,
}: { children: any; value: string; onValueChange: (value: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{value === "all" ? "All Courses" : value || "Select..."}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {React.Children.map(children, (child) =>
            React.cloneElement(child as any, {
              onClick: () => {
                onValueChange((child as any).props.value)
                setIsOpen(false)
              },
            }),
          )}
        </div>
      )}
    </div>
  )
}

const SelectTrigger = ({ children }: { children: any }) => <>{children}</>
const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>
const SelectContent = ({ children }: { children: any }) => <>{children}</>
const SelectItem = ({ children, value, onClick }: { children: any; value: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
  >
    {children}
  </div>
)

const Dialog = ({
  children,
  open,
  onOpenChange,
}: { children: any; open: boolean; onOpenChange: (open: boolean) => void }) => {
  if (!open) return <>{React.Children.toArray(children)[0]}</>

  return (
    <>
      {React.Children.toArray(children)[0]}
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {React.Children.toArray(children)[1]}
        </div>
      </div>
    </>
  )
}

const DialogTrigger = ({ children, asChild }: { children: any; asChild?: boolean }) => <>{children}</>
const DialogContent = ({ children, className = "" }: { children: any; className?: string }) => (
  <div className={className}>{children}</div>
)
const DialogHeader = ({ children }: { children: any }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
)
const DialogTitle = ({ children }: { children: any }) => (
  <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>
)
const DialogDescription = ({ children }: { children: any }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
)

const ToastContainer = ({
  toasts,
}: { toasts: Array<{ id: string; title: string; description?: string; variant?: "default" | "destructive" }> }) => (
  <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          toast.variant === "destructive"
            ? "border-destructive bg-destructive text-destructive-foreground"
            : "border bg-background text-foreground",
        )}
      >
        <div className="grid gap-1">
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
        </div>
      </div>
    ))}
  </div>
)

interface Assignment {
  id: string
  title: string
  course: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}

const COURSES = [
  "English I",
  "English II",
  "English III",
  "English IV",
  "Algebra I",
  "Geometry",
  "Algebra II",
  "Pre-Calculus",
  "Calculus AB",
  "Calculus BC",
  "Statistics",
  "Biology",
  "Chemistry",
  "Physics",
  "Anatomy & Physiology",
  "World History",
  "US History",
  "Government",
  "Economics",
  "Spanish I",
  "Spanish II",
  "French I",
  "French II",
  "Computer Science A",
  "Art I",
  "Theatre Arts",
  "Band",
  "Health",
  "PE",
  "Psychology",
]

export default function SchoolworkTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [firebaseError, setFirebaseError] = useState<string | null>(null)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const { toast, toasts } = useToast()

  // Real-time listener for assignments
  useEffect(() => {
    if (!db) {
      setFirebaseError("Firebase is not properly configured. Please check your environment variables.")
      setLoading(false)
      return
    }

    try {
      const q = query(collection(db, "assignments"), orderBy("dueDate", "asc"))
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const assignmentsList: Assignment[] = []
          querySnapshot.forEach((doc) => {
            assignmentsList.push({ id: doc.id, ...doc.data() } as Assignment)
          })
          setAssignments(assignmentsList)
          setLoading(false)
          setFirebaseError(null)
        },
        (error) => {
          console.error("Firestore listener error:", error)
          setFirebaseError("Failed to connect to database. Please check your Firebase configuration.")
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up Firestore listener:", error)
      setFirebaseError("Failed to initialize database connection.")
      setLoading(false)
    }
  }, [])

  // Filter assignments based on course and completion status
  useEffect(() => {
    let filtered = assignments

    if (selectedCourse && selectedCourse !== "all") {
      filtered = filtered.filter((assignment) => assignment.course === selectedCourse)
    }

    if (!showCompleted) {
      filtered = filtered.filter((assignment) => !assignment.completed)
    }

    setFilteredAssignments(filtered)
  }, [assignments, selectedCourse, showCompleted])

  const addAssignment = async (e: any) => {
    e.preventDefault()
    if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!db) {
      toast({
        title: "Database Error",
        description: "Firebase is not properly configured.",
        variant: "destructive",
      })
      return
    }

    try {
      await addDoc(collection(db, "assignments"), {
        ...newAssignment,
        completed: false,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "Success!",
        description: "Assignment added successfully.",
      })

      setAddDialogOpen(false)
      setNewAssignment({
        title: "",
        course: "",
        description: "",
        dueDate: "",
        priority: "medium",
      })
    } catch (error) {
      console.error("Error adding assignment:", error)
      toast({
        title: "Error",
        description: "Failed to add assignment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleComplete = async (assignment: Assignment) => {
    if (!db) {
      toast({
        title: "Database Error",
        description: "Firebase is not properly configured.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateDoc(doc(db, "assignments", assignment.id), {
        completed: !assignment.completed,
      })

      toast({
        title: assignment.completed ? "Assignment marked incomplete" : "Assignment completed!",
        description: `${assignment.title} has been updated.`,
      })
    } catch (error) {
      console.error("Error updating assignment:", error)
      toast({
        title: "Error",
        description: "Failed to update assignment.",
        variant: "destructive",
      })
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (!db) {
      toast({
        title: "Database Error",
        description: "Firebase is not properly configured.",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteDoc(doc(db, "assignments", assignmentId))
      toast({
        title: "Assignment deleted",
        description: "Assignment has been removed.",
      })
    } catch (error) {
      console.error("Error deleting assignment:", error)
      toast({
        title: "Error",
        description: "Failed to delete assignment.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getUrgencyBadge = (dueDate: string, completed: boolean) => {
    if (completed) return null

    const daysUntil = getDaysUntilDue(dueDate)
    if (daysUntil < 0) {
      return <Badge className="bg-red-500 text-white">Overdue</Badge>
    } else if (daysUntil === 0) {
      return <Badge className="bg-orange-500 text-white">Due Today</Badge>
    } else if (daysUntil === 1) {
      return <Badge className="bg-yellow-500 text-white">Due Tomorrow</Badge>
    } else if (daysUntil <= 3) {
      return <Badge className="bg-blue-500 text-white">Due Soon</Badge>
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schoolwork Tracker</h1>
                <p className="text-sm text-gray-600">Stay organized with your assignments</p>
              </div>
            </div>

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Assignment</DialogTitle>
                  <DialogDescription>Create a new assignment to track your schoolwork.</DialogDescription>
                </DialogHeader>
                <form onSubmit={addAssignment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Math Homework Chapter 5"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="course">Course *</Label>
                      <Select
                        value={newAssignment.course}
                        onValueChange={(value) => setNewAssignment({ ...newAssignment, course: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {COURSES.map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newAssignment.priority}
                        onValueChange={(value) =>
                          setNewAssignment({
                            ...newAssignment,
                            priority: value as "low" | "medium" | "high",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional details about the assignment..."
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Add Assignment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {firebaseError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Firebase Configuration Error</h3>
                <p className="text-sm text-red-700 mt-1">{firebaseError}</p>
                <p className="text-xs text-red-600 mt-2">
                  Please ensure all Firebase environment variables are set in your .env.local file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Assignments</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="showCompleted" checked={showCompleted} onCheckedChange={setShowCompleted} />
              <Label htmlFor="showCompleted">Show completed</Label>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Your Assignments
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredAssignments.length} {filteredAssignments.length === 1 ? "assignment" : "assignments"})
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500 text-center mb-4">
                  {selectedCourse !== "all" || !showCompleted
                    ? "No assignments match your current filters."
                    : "Get started by adding your first assignment!"}
                </p>
                <Button onClick={() => setAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className={`hover:shadow-lg transition-shadow duration-200 ${
                    assignment.completed ? "opacity-75" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle
                        className={`text-lg leading-tight ${assignment.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {assignment.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {getUrgencyBadge(assignment.dueDate, assignment.completed)}
                        <Badge className={getPriorityColor(assignment.priority)} variant="secondary">
                          {assignment.priority}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {assignment.course}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignment.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due: {formatDate(assignment.dueDate)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getDaysUntilDue(assignment.dueDate) >= 0
                          ? `${getDaysUntilDue(assignment.dueDate)} days left`
                          : `${Math.abs(getDaysUntilDue(assignment.dueDate))} days overdue`}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant={assignment.completed ? "outline" : "default"}
                        size="sm"
                        className="flex-1"
                        onClick={() => toggleComplete(assignment)}
                      >
                        {assignment.completed ? (
                          <>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Mark Incomplete
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
