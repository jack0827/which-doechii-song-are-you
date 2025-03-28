# Use .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy everything first
COPY . . 

# Restore only the correct project file
RUN dotnet restore whichdoechiisongareu.csproj

# Build and publish the app
RUN dotnet publish whichdoechiisongareu.csproj -c Release -o /out

# Use .NET runtime to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Expose port for Railway
ENV ASPNETCORE_URLS=http://+:8080
CMD ["dotnet", "whichdoechiisongareu.dll"]
