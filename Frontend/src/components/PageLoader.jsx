import { LoaderIcon } from "lucide-react"


function PageLoader() {
  return (
    <div className="min-h-screen flex justify-center items-center">
        <LoaderIcon className="animate-spin size-10 text-primary"/>
    </div>
  )
}

export default PageLoader