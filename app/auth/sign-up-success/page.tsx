import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}