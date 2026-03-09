import { motion, AnimatePresence } from "motion/react";
import { Quote, Headphones, Plus, Star } from "lucide-react";
import { useState } from "react";
import ReviewModal from "./ReviewModal";

const initialTestimonials = [
  {
    quote: "The new Web App is incredible. I use the Live Translation feature during my international calls, and it's like having a personal interpreter right in my browser.",
    author: "David Chen",
    role: "Global Operations Director",
    image: "https://picsum.photos/seed/david/100/100"
  },
  {
    quote: "This app completely changed how I handle client meetings. I catch details I used to miss, and the emotional analysis helps me understand what they aren't saying.",
    author: "Sarah Jenkins",
    role: "Product Manager",
    image: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    quote: "As a journalist, accurate transcription is life or death. The Listening Project not only transcribes perfectly but helps me find the 'hook' in every interview.",
    author: "Mark Davis",
    role: "Senior Editor",
    image: "https://picsum.photos/seed/mark/100/100"
  },
  {
    quote: "Finally, a tool that helps me focus on the person, not just taking notes. The real-time summaries are a game changer for my therapy practice.",
    author: "Dr. Elena Rodriguez",
    role: "Clinical Psychologist",
    image: "https://picsum.photos/seed/elena/100/100"
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleAddReview = (newReview: { author: string; role: string; quote: string; image: string }) => {
    setTestimonials([newReview, ...testimonials]);
    setIsReviewModalOpen(false);
  };

  return (
    <section id="testimonials" className="py-24 bg-black relative">
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-5xl font-bold font-display">Trusted by Better Listeners</h2>
            <Headphones className="w-8 h-8 md:w-10 md:h-10 text-brand-500" style={{ color: '#00e5ff', filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.4))' }} />
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who are upgrading their communication skills.
          </p>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors border border-white/10 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5 text-brand-400" style={{ color: '#33eaff' }} />
            Add Your Story
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.author}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl relative group hover:bg-white/[0.07] transition-colors"
              >
                <Quote className="absolute top-8 right-8 w-8 h-8 text-brand-500/10 group-hover:text-brand-500/40 transition-colors" style={{ color: 'rgba(0,229,255,0.1)' }} />

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    width="48"
                    height="48"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.author}</h4>
                    <p className="text-sm text-brand-400/80">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
