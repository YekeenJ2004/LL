export const applyHtmlContent = (username, text)=>{
    return(
        `<div>
            <p>Hello ${username},</p>
            <p>${text}</p>
            <footer style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
                <p>Best regards,</p>
                <p>Your Company Name</p>
                <p><a href="https://www.linkloop.app">www.linkloop.app</a></p>
            </footer>
        </div>`
    )
}


