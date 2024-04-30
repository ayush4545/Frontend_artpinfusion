const downloadFile = async (
  url: string,
  filename: string = "download file.jpg"
) => {
  fetch(url, {
    headers: {
      Accept: "image/*, video/*", // Specify the expected content type
    },
  })
    .then((response) => {
      // Handle response
      if (response.ok) {
        return response.blob(); // Get the image data as a Blob object
      }
      throw new Error("Network response was not ok.");
    })
    .then((imageBlob) => {
      // Use the image data (Blob) as needed
      const imageUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.setAttribute("download", filename); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
    });
};

export default downloadFile;
