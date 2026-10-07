import type { Review } from "../content/bio";

export const ReviewQuote = ({ review }: { review: Review }) => (
  <figure class="sc-review">
    <blockquote class="sc-review__quote" cite={review.citation}>
      <p class="sc-review__content">{review.content}</p>
    </blockquote>
    <figcaption class="sc-review__source">
      {review.citation ? <a href={review.citation}>{review.source}</a> : review.source}
    </figcaption>
  </figure>
);

// Flush tiles, like the line-up: quote in bold body type, source in stamp type.
export const Reviews = ({ reviews }: { reviews: Review[] }) => (
  <ul class="sc-reviews">
    {reviews.map((review) => (
      <li class="sc-reviews__item">
        <ReviewQuote review={review} />
      </li>
    ))}
  </ul>
);