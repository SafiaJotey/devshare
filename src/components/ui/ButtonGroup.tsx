import React from 'react'
import { Button } from './button'
import { ArrowRight } from 'lucide-react'

export default function ButtonGroup() {
  return (
      <div
             
              className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
            >
              <Button
                size="lg" 
                className="group gap-2 shadow-lg cursor-pointer hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary/30 dark:border-dark-text/30 cursor-pointer group transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="bg-gradient-to-r from-accent to-primary dark:from-dark-accent dark:to-dark-primary bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black">
                  Meet The Authors
                </span>
              </Button>
            </div>
  )
}
