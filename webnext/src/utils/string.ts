export function youtubeExtractstring(url: string) {
    const match = url.match(/(?<=\bv=)[\w-]{11}/);
    return match ? match[0] : '';
}

export function shrinkText(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength - 3) + '...';
    }
    return text;
}

export function formatViews(viewsString: string) {
    // Extract the number part from the string and remove commas
    const viewsNumber = parseInt(viewsString.replace(/[^0-9]/g, ''));

    // Convert the number into a shortened format
    // Convert the number into a shortened format
    const suffixes = ["", "k", "M", "B"];
    const suffixNum = Math.floor(Math.log10(viewsNumber) / 3);
    const shortValue = (viewsNumber / Math.pow(10, suffixNum * 3)).toPrecision(3);
    return shortValue + suffixes[suffixNum] + " views";
}


export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const extractEmailPrefix = (email: string): string => {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
        return email.substring(0, atIndex);
    } else {
        // If the email doesn't contain '@', return the entire email
        return email;
    }
};


export function isYouTubeURL(url: string): boolean {
    const youtubeRegex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    return youtubeRegex.test(url);
}


export function formatDate(isoTimestamp:string){
    const date = new Date(isoTimestamp);

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
    return formattedDate
}