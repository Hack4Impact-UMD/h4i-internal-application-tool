import { storage } from "@/config/firebase";
import { getDownloadURL, getMetadata, ref, uploadBytesResumable, UploadMetadata } from "firebase/storage";

export async function uploadFile(file: File, path: string, onProgress: (progress: number) => void, metadata?: UploadMetadata): Promise<string> {
	const fileRef = ref(storage, path);

	return new Promise((resolve, reject) => {
		const uploadTask = uploadBytesResumable(fileRef, file, metadata);
		uploadTask.on('state_changed', snapshot => {
			onProgress(snapshot.bytesTransferred / snapshot.totalBytes)
		}, err => {
			reject(err)
		}, async () => {
			return resolve(fileRef.fullPath)
		})
	})
}

export async function getFileURL(path: string) {
	return await getDownloadURL(ref(storage, path))
}

export async function getFileMetadata(path: string) {
	return await getMetadata(ref(storage, path))
}
