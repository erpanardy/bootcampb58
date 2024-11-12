async function getAllTestimonials() {
  try {
    let testimonials = await fetch(
      "https://api.npoint.io/547ddcee77fc53903251"
    );
    testimonials = await testimonials.json();

    const testimonialHTML = testimonials.map((testimonial) => {
      return `<div class="col">
        <div class="card">
          <img
            src="${testimonial.images}"
            class="card-img-top p-3"
            style="height: 300px;"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title fst-italic">"${testimonial.content}"</h5>
            <p class="author d-flex justify-content-end">${testimonial.author}</p>
              <p class="d-flex justify-content-end"><i class="fa-solid fa-star bg-black text-white rounded-2 text-center" style="width: 4rem;">${testimonial.start}</i></p>
          </div>
        </div>
      </div>`;
    });
    document.getElementById("testimonial").innerHTML = testimonialHTML.join("");
  } catch (error) {
    console.error(error);
  }
}

async function getTestimonialByStart(start) {
  try {
    let testimonials = await fetch(
      "https://api.npoint.io/547ddcee77fc53903251"
    );
    testimonials = await testimonials.json();

    const filteredTestimonials = testimonials.filter((testimonial) => {
      return testimonial.start === start;
    });

    const testimonialHTML = filteredTestimonials.map((testimonial) => {
      return `  <div class="col">
        <div class="card">
          <img
            src="${testimonial.images}"
            class="card-img-top p-3 rounded-3"
            style="height: 300px;"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title fst-italic">"${testimonial.content}"</h5>
            <p class="author d-flex justify-content-end">${testimonial.author}</p>
              <p class="d-flex justify-content-end"><i class="fa-solid fa-star bg-black text-white rounded-2 text-center" style="width: 4rem;">${testimonial.start}</i></p>
          </div>
        </div>
      </div>`;
    });

    document.getElementById("testimonial").innerHTML = testimonialHTML.join("");
  } catch (error) {
    console.error(error);
  }
}
getAllTestimonials();
