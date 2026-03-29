import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const Reviews = ({ productId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(`reviews_${productId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const averageRating = useMemo(() => {
    if (!reviews.length) return '0.0';
    return (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  const breakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      counts[review.rating - 1] += 1;
    });
    return counts;
  }, [reviews]);

  const saveReviews = (nextReviews) => {
    setReviews(nextReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(nextReviews));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      showToast('Please log in to leave a review.', 'error');
      return;
    }

    if (!rating || !comment.trim()) {
      showToast('Please add a rating and a short review.', 'error');
      return;
    }

    const nextReviews = [
      {
        productId,
        user: user.email,
        rating,
        comment: comment.trim(),
        date: new Date().toLocaleDateString(),
      },
      ...reviews,
    ];

    saveReviews(nextReviews);
    setRating(0);
    setComment('');
    showToast('Review submitted successfully.', 'success');
  };

  return (
    <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Customer feedback</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Reviews and ratings</h2>
        </div>

        <div className="min-w-[220px] rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black text-slate-900">{averageRating}</span>
            <div>
              <div className="text-amber-500">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={`avg-star-${index}`}
                    className={`bi ${index < Math.round(Number(averageRating)) ? 'bi-star-fill' : 'bi-star'} mr-1`}
                    aria-hidden="true"
                  ></i>
                ))}
              </div>
              <p className="text-sm text-slate-500">{reviews.length} reviews</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-6 text-slate-600">{star}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-amber-400"
                    style={{
                      width: `${(breakdown[star - 1] / reviews.length) * 100 || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
              No reviews yet. Be the first customer to share feedback.
            </div>
          ) : (
            reviews.map((review, index) => (
              <article key={`${review.user}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {review.user?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{review.user}</p>
                      <p className="text-xs text-slate-500">{review.date}</p>
                    </div>
                  </div>

                  <div className="text-amber-500">
                    {[...Array(5)].map((_, starIndex) => (
                      <i
                        key={`review-star-${index}-${starIndex}`}
                        className={`bi ${starIndex < review.rating ? 'bi-star-fill' : 'bi-star'} mr-1`}
                        aria-hidden="true"
                      ></i>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{review.comment}</p>
              </article>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-bold text-slate-900">Write a review</h3>
          <p className="mt-1 text-sm text-slate-500">Help other shoppers choose the right laptop.</p>

          <div className="mt-5 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${star <= rating ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                aria-label={`Rate ${star} stars`}
              >
                <i className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`} aria-hidden="true"></i>
              </button>
            ))}
          </div>

          <textarea
            className="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={5}
            placeholder="Share your experience with this product"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />

          <button
            type="submit"
            className="mt-4 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Submit review
          </button>
        </form>
      </div>
    </section>
  );
};

export default Reviews;
