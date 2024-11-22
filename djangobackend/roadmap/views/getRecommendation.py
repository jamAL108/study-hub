from django.http import JsonResponse
from rest_framework.views import APIView
import json
from roadmap.serializers.getRecommendation import getRecommendation
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from urllib.parse import urljoin, quote

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class getRecommendation(APIView):
    serializer_class = getRecommendation
    
    
    def get_selenium_driver(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        chrome_options.add_argument("--disable-bots")
        chrome_options.add_argument("user-agent=Mozilla/5.0 ...")

        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        return driver
    
    def scrape_udemy_courses(self,search_query):
        # Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in background
        
        # Setup WebDriver
        driver = self.get_selenium_driver()
        
        # Navigate to Udemy
        driver.get(f"https://www.udemy.com/courses/search/?q={search_query}")
        
        # Wait for content to load
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div.course-list--container--HY2ry'))
        )
        
        # Get page source after JavaScript renders
        page_source = driver.page_source
        # Parse with BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Find course links
        course_links = soup.select('div.ud-container')
        print(course_links)
        # Close browser
        driver.quit()
        
        return course_links

        
        
        
    def get(self, request):
        """
        Handle GET requests.
        """
        try:
            data = request.data  # Use request.data for POST
            serializer = self.serializer_class(data=data)
            
            if not serializer.is_valid():
                error_messages = [str(error) for error in serializer.errors['q']]
                return JsonResponse({'Error': error_messages[0]}, status=404)
            
            valid_data = serializer.validated_data
            max_results = int(request.data.get('max_results', 10))
            print(valid_data.get("q"))
            if valid_data.get("q"):
                # Perform web scraping
                course_urls = self.scrape_udemy_courses(valid_data.get("q"))
                return JsonResponse({"courses":course_urls},status=200)
            else:
                return JsonResponse({'error': 'Missing search terms'},status=400)
        except Exception as e:
            print(str(e))
            return JsonResponse({'Error':'Internal Server Error'},status=500)




# course-list--container--HY2ry