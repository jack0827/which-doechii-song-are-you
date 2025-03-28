# Use .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy ONLY the solution and project files first (to speed up build process)
COPY *.sln . 
COPY whichdoechiisongareu/*.csproj whichdoechiisongareu/

# Restore dependencies
RUN dotnet restore whichdoechiisongareu/whichdoechiisongareu.csproj

# Copy everything else AFTER restoring
COPY . .

# Set working directory to project folder
WORKDIR /app/whichdoechiisongareu

# Build and publish the app
RUN dotnet publish -c Release -o /out

# Use .NET runtime to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Expose port for Railway
ENV ASPNETCORE_URLS=http://+:8080
CMD ["dotnet", "whichdoechiisongareu.dll"]
