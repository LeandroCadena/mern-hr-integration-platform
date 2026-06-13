# Unified HR Integration Platform

A full-stack MERN application that simulates HRIS and Payroll integrations through a unified platform.

## Overview

This project demonstrates how different HR providers can be connected through a common integration layer. It includes authentication, role-based access control, employee normalization, synchronization logs, dashboard metrics, and a React frontend.

The platform is inspired by products such as Merge.dev and Finch.

## Features

### Authentication & Security

* JWT Authentication
* Protected Routes
* Role-Based Access Control (RBAC)

### Company Management

* Create Companies
* View Companies
* Associate Providers to Companies

### Provider Integrations

* Workday Integration
* ADP Integration
* BambooHR Integration

### Employee Import

* Import employees from external providers
* Adapter Pattern implementation
* Canonical Employee Model
* Idempotent imports using MongoDB upserts

### Observability

* Sync Logs
* Dashboard Metrics
* Import Success/Failure Tracking

### User Experience

* React Router
* React Hook Form
* Zod Validation
* Toast Notifications
* Loading States

## Architecture

Frontend (React + Vite)
↓
Backend (Node.js + Express)
↓
MongoDB Atlas

Provider Payload
↓
Adapter Layer
↓
Canonical Employee Model
↓
MongoDB

## Tech Stack

### Frontend

* React
* Vite
* React Router
* React Hook Form
* Zod
* Axios
* React Toastify

### Backend

* Node.js
* Express
* JWT
* Mongoose

### Database

* MongoDB Atlas

### DevOps

* Docker
* Docker Compose (coming soon)

## Project Structure

backend/
├── controllers
├── routes
├── models
├── middleware
├── adapters
└── services

frontend/
├── pages
├── components
├── context
├── services
└── styles

## Running Locally

### Backend

cd backend

npm install

npm run dev

### Frontend

cd frontend

npm install

npm run dev

## Docker

### Backend

docker build -t hr-platform-backend .

docker run -p 5000:5000 --env-file .env hr-platform-backend

### Frontend

docker build -t hr-platform-frontend .

docker run -p 5173:5173 hr-platform-frontend

## Future Improvements

* Docker Compose
* GitHub Actions CI/CD
* Deployment to Render
* Deployment to Vercel
* CSV Employee Import
* Scheduled Synchronizations
* Webhook Integrations
* Pagination & Filtering
* Advanced Audit Logs

## Author

Leandro Cadena

Full Stack Developer focused on Backend Engineering, Integrations, Cloud Architecture, and HR/Payroll Platforms.
