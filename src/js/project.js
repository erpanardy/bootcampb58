function submitBtn(event) {
  event.preventDefault();

  const projectName = document.getElementById("projectName").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("uploadImage").files[0];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30));

  const technologies = [];
  if (document.getElementById("nodejs").checked) {
    technologies.push("Node Js");
  }
  if (document.getElementById("reactjs").checked) {
    technologies.push("React Js");
  }
  if (document.getElementById("nextjs").checked) {
    technologies.push("Next Js");
  }
  if (document.getElementById("typescript").checked) {
    technologies.push("TypeScript");
  }

  const cardContainer = document.getElementById("cardContainer");
  const card = document.createElement("div");
  card.className = "card mt-3";

  let imageUrl = "asset/cofee.jpg";
  if (image) {
    imageUrl = URL.createObjectURL(image);
  }

  card.innerHTML = `
            <img src="${imageUrl}" class="card-img" alt="Project Image">
            <div class="card-body">
                <h5 class="card-title">${projectName}</h5>
                <p class="duration"><strong>Duration:</strong> ${duration} months</p>
                <p class="card-text">${description}</p>
                <div class="icon-projet">
                    <i class="fa-brands fa-google-play"></i>
                    <i class="fa-brands fa-android"></i>
                    <i class="fa-brands fa-java"></i>
                </div>
                <div class="btn-card mt-3">
                    <a href="#" class="btn btn-primary">Edit</a>
                    <a href="#" class="btn btn-danger">Delete</a>
                </div>
            </div>
        `;

  cardContainer.appendChild(card);

  document.getElementById("content").reset();
}
