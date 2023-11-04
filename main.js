window.onload = async () => {
  const fileBtn = document.querySelector("input[type=file]");
  const form = document.getElementById("form");
  const sortCategoriesCheck = document.getElementById("sortCategoriesCheck");
  const titleInput = document.getElementById("titleInput");
  const sortWithinCategoriesCheck = document.getElementById(
    "sortWithinCategoriesCheck"
  );

  let itemsPerCol = 36;
  const itemsPerPage = itemsPerCol * 3;

  let itemCount = 0;
  let sectionCount = 0;
  let currentSection;
  let title = "GROCERY LIST";

  const reader = new FileReader();

  titleInput.addEventListener("input", (e) => (title = e.target.value));

  fileBtn.onchange = (e) => {
    reader.readAsText(e.target.files[0]);
  };

  const createRow = (word) => {
    const row = document.createElement("div");
    row.classList.add("row");
    const line = document.createElement("div");
    line.classList.add("line");
    const text = document.createElement("p");
    text.classList.add("item");
    text.innerText = word;
    if (word == "" || word == " " || word == "  ") {
      text.classList.add("blank");
    }
    if (word == "^") {
      row.classList.add("empty");
      text.innerText = "";
    }
    row.append(line, text);
    return row;
  };

  const trimAndCapList = (list) => {
    const fixedList = list.map((li) => {
      li = li.replace("\r", "");
      li = li.replace("�", "'");
      if (li === "" || li === " " || li === "  " || li === "   ") {
        return " ";
      } else {
        li = li.trim();

        let word = [];

        li.split(" ").forEach((lif) => {
          if (lif[0] == "(") {
            word.push(lif[0] + lif[1].toUpperCase() + lif.slice(2));
          } else {
            word.push(lif[0].toUpperCase() + lif.slice(1));
          }
        });
        return word.join(" ");
      }
    });
    return fixedList;
  };

  const sortList = (list) => {
    const sortedList = [
      list[0],
      ...list.slice(1).sort((a, b) => {
        if (a == "" || a == " " || a == "  ") return 1;
        else if (b == "" || b == " " || b == "  ") return -1;
        else if (a > b) return 1;
        else if (a < b) return -1;
        else return 0;
      }),
    ];
    return sortedList;
  };

  const addSection = () => {
    const section = document.createElement("section");
    sectionCount++;
    const pageNum = document.createElement("span");
    pageNum.classList.add("pageNum");
    pageNum.innerText = sectionCount;
    section.append(pageNum);
    document.body.append(section);
    const titleEl = document.createElement("h1");
    titleEl.classList.add("title");
    titleEl.innerText = title;
    section.append(titleEl);
    currentSection = section;
  };

  reader.onloadend = () => {
    const stringArr = reader.result.split("\n");
    let lists = stringArr.map((l) => l.split(","));
    form.classList.add("hidden");

    if (sortCategoriesCheck.checked) {
      lists = lists.sort((a, b) => (a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0));
    }

    // add first section
    addSection();

    lists.forEach((list) => {
      // skip any lists with one item
      if (list.length > 1) {
        // trim and capitalize the list items
        list = trimAndCapList(list);

        // sort lists if requested
        if (sortWithinCategoriesCheck.checked) {
          list = sortList(list);
        }

        // loop through lists and create elements
        list.forEach((item, i) => {
          // create, add, and set new section if page full
          if (itemCount > 0 && itemCount % itemsPerPage === 0) {
            addSection();
          }

          let row;
          if (i === 0) {
            row = document.createElement("div");
            row.classList.add("row");
            const title = document.createElement("h5");
            title.innerText = item;
            row.append(title);
          } else {
            row = createRow(item);
          }
          currentSection.append(row);
          itemCount++;
        });

        // add blank space at end of list if not end of page
        if (itemCount % itemsPerPage !== 0) {
          const blankSpace = document.createElement("div");
          blankSpace.classList.add("row", "empty");
          currentSection.append(blankSpace);
          itemCount++;
        }
      }
    });

    // initiate print
    print();
  };
};
