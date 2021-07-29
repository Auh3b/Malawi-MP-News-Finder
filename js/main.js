// serpApi key
const apiKey =
  "5fcfb3698bfe5c573d6398cc324fb3c0e7c9016110ad75e61d10e408b40d57ad";

// parties
const partiesList = (data) => {
  let parties = new Set(data.map((i) => i.Party));
  return Array.from(parties);
};

// get representives
const repList = (data) => {
  let filtered = data.forEach((i) => {
    $("#reps").append(`<option value="${i.Name}"> ${i.Name}</option>`);
  });
};

/**============= get single rep info====**/
const repInfo = (data) => {
  $(".rep-showcase").empty();
  let rep = data[0];
  let html = `<div class="rounded overflow-hiddedn py-5 md:py-1">
                  <img class ="w-5/6 mx-auto" src="../assets/profile.png" />
                  <div class="px-6 py-2">
                    <p class="pb-2 border-b-2 border-gray-500">Name: ${rep.Name}</p>
                    <p class="pb-2 border-b-2 border-gray-500">Constituency: ${rep.Constituency}</p>
                    <p class="pb-2 border-b-2 border-gray-500">Party: ${rep.Party}</p>
                  </div>
                </div>`;
  $(".rep-showcase").append(html);
};
/* ==================================== */

/*======= Latest Rep News ========*/
const latestNews = ({ news_results }, { value }) => {
  $(".info-loc").empty();
  if (news_results.length > 0) {
    let articles = news_results;
    console.log(articles);
    articles.forEach(({ date, link, snippet, source, thumbnail, title }) => {
      let html = `<div class="flex flex-row">
                    <div class = "w-20 h-20 style ="background-image: url('${thumbnail}')"">
                    </div>
                    <div class="flex flex-col border border-gray-800 p-2">
                      <h3 class="font-bold">${title}</h3>
                      <hr class="border-t border-gray-300" />
                      <p class="font-light my-3">
                        ${snippet}
                      </p>
                      <p class="my-2 ">${source} - ${date}</p>
                      <a class="md:self-end  py-2 px-4 bg-gray-800 text-gray-100" href=${link} target="_blank">Read More...</a>
                    </div>
                  </div>`;
      $(".info-loc").append(html);
    });
  } else {
    let message = `<p class="text-center">There is no news articles for <span class="font-bold">${value}</spa></p>`;
    $(".info-loc").append(message);
  }
};

$(document).ready(() => {
  // author
  let author = "Chikondi Ngaiyaye";
  $(".author").text(author);

  // date
  let date = new Date();
  $(".date").text(date.getFullYear());

  // load data
  $.get("../data/mpsList.json").then((data, status) => {
    // add set options
    partiesList(data).forEach((i) => {
      $("#party").append(`<option value="${i}"> ${i}</option>`);
    });

    $("#party").on("change", () => {
      $("#reps").empty();
      let filtered = data.filter((i) => i.Party == $("#party").val());
      repList(filtered);
    });

    $("#reps").change(({ target }) => {
      let rep = data.filter((i) => i.Name == target.value);
      repInfo(rep);
      $.get(
        `https://serpapi.com/search.json?engine=google&q=${target.value}&tbm=nws&api_key=${apiKey}`
      ).then((data, status) => {
        latestNews(data, target);
      });
    });
  });
});
