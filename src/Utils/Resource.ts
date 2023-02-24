
export function createImgFromUrl(url: string, width=512, height=512) :Promise<HTMLImageElementj>{

	return new Promise((resolve, reject)=>{

		// Create an image object
		const image = new Image();

		// Set the texture image source URL
		image.src = url;

		image.crossOrigin = ''

		// Load the image from the URL
		image.onload = () => {
			resolve(image)
		}

	})



}
