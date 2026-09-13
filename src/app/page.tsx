import { Hero } from '@/components/hero/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { About } from '@/components/sections/About'
import { Systems } from '@/components/sections/Systems'
import { EvaluationLab } from '@/components/sections/EvaluationLab'
import { Experience } from '@/components/sections/Experience'
import { Capabilities } from '@/components/sections/Capabilities'
import { WritingTeaser } from '@/components/sections/WritingTeaser'
import { Contact } from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <Systems />
      <EvaluationLab />
      <Experience />
      <Capabilities />
      <WritingTeaser />
      <Contact />
    </>
  )
}
