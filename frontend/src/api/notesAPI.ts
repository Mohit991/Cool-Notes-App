import { ConflictError, UnauthorizedError } from "../errors/http_errors"
import { Note } from "../models/note"
import { User } from "../models/user"

async function fetchData(input: RequestInfo, init?: RequestInit){
    // const url = "http://localhost:5000" + input  
    const url = "https://cool-notes-app-backend.vercel.app" + input
    const response = await fetch(url, init)
    if(response.ok){
        return response
    }
    else{
        const errorBody = await response.json()
        const errorMessage = errorBody.error
        if(response.status === 401){
            throw new UnauthorizedError(errorMessage)
        }
        else if(response.status === 409){
            throw new ConflictError(errorMessage)
        }
        else{
            throw Error("Request failed with status: "+response.status + " .Message is "+errorMessage)
        }
    }
}

export async function getLoggedInUser(): Promise<User>{
    const response = await fetchData("/api/user", {
        method: "GET",
        credentials: "same-origin",   
    })
    return response.json()
}

export interface SignUpCredentials {
    username: string, 
    email: string,
    password: string
}
export async function signUp(credentials :SignUpCredentials): Promise<User>{
    const response = await fetchData('/api/user/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    })
    return response.json()
}

export interface LoginInCredentials {
    username: string, 
    password: string
}
export async function logIn(credentials: LoginInCredentials): Promise<User> {
    const response = await fetchData('/api/user/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(credentials)
    })
    return response.json()
}

export async function logOut(){
    await fetchData('/api/user/logout', {
        method: "POST",
        credentials: 'include',
    })
}

export async function fetchNotes(): Promise<Note[]>{
    const response = await fetchData("/api/notes", {method: "GET", credentials: "same-origin"})
    return await response.json()    
}

export interface NoteInput {
    title: string, 
    text?: string
}
export async function createNote(note: NoteInput): Promise<Note>{
    const response = await fetchData('/api/notes', 
    {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        }, 
        credentials: 'include',
        body: JSON.stringify(note)
    })
    return response.json()
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note>{
    const response = await fetchData(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(note)
    })
    return response.json()
}

export async function deleteNote(noteId: string){
    await fetchData(`/api/notes/${noteId}`, {
        method: "DELETE",
        credentials: 'include',
    })
}
