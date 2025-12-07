#!/bin/bash

# Comprehensive Marketplace API Test Script
# Tests all marketplace endpoints on running server

CMS_URL="http://149.13.60.6:4002"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== Marketplace API Comprehensive Test ===${NC}\n"
echo -e "${BLUE}Server: ${CMS_URL}${NC}\n"

total_tests=0
passed_tests=0

# Test 1: GET /api/marketplaces
echo -e "${CYAN}Test 1: GET /api/marketplaces${NC}"
total_tests=$((total_tests + 1))
response=$(curl -s "${CMS_URL}/api/marketplaces")
if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, list) else 1)" 2>/dev/null; then
    count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
    echo -e "${GREEN}✅ PASSED${NC} - Found ${count} marketplaces"
    passed_tests=$((passed_tests + 1))
    marketplace_id=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if data else '')" 2>/dev/null)
    marketplace_route=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0].get('route', '') if data else '')" 2>/dev/null)
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "$response" | head -c 200
    echo ""
fi

# Test 2: GET /api/admin/marketplaces
echo -e "\n${CYAN}Test 2: GET /api/admin/marketplaces${NC}"
total_tests=$((total_tests + 1))
response=$(curl -s "${CMS_URL}/api/admin/marketplaces")
if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, list) else 1)" 2>/dev/null; then
    count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
    echo -e "${GREEN}✅ PASSED${NC} - Found ${count} marketplaces (including hidden)"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "$response" | head -c 200
    echo ""
fi

# Test 3: GET /api/marketplaces/categories
echo -e "\n${CYAN}Test 3: GET /api/marketplaces/categories${NC}"
total_tests=$((total_tests + 1))
response=$(curl -s "${CMS_URL}/api/marketplaces/categories")
if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, list) else 1)" 2>/dev/null; then
    count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
    echo -e "${GREEN}✅ PASSED${NC} - Found ${count} categories"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "$response" | head -c 200
    echo ""
fi

# Test 4: GET /api/main-marketplaces
echo -e "\n${CYAN}Test 4: GET /api/main-marketplaces${NC}"
total_tests=$((total_tests + 1))
response=$(curl -s "${CMS_URL}/api/main-marketplaces")
if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, dict) and 'hero' in data else 1)" 2>/dev/null; then
    hero_title=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('hero', {}).get('title', 'N/A'))" 2>/dev/null)
    sections_count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('sections', [])))" 2>/dev/null)
    echo -e "${GREEN}✅ PASSED${NC} - Hero: ${hero_title}, Sections: ${sections_count}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "$response" | head -c 200
    echo ""
fi

# Test 5: GET /api/marketplaces/:id (if we have an ID)
if [ ! -z "$marketplace_id" ]; then
    echo -e "\n${CYAN}Test 5: GET /api/marketplaces/${marketplace_id}${NC}"
    total_tests=$((total_tests + 1))
    response=$(curl -s "${CMS_URL}/api/marketplaces/${marketplace_id}")
    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, dict) and 'id' in data else 1)" 2>/dev/null; then
        name=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('name', 'N/A'))" 2>/dev/null)
        echo -e "${GREEN}✅ PASSED${NC} - Marketplace: ${name}"
        passed_tests=$((passed_tests + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "$response" | head -c 200
        echo ""
    fi
    
    # Test 6: GET /api/marketplaces/:id/sections
    echo -e "\n${CYAN}Test 6: GET /api/marketplaces/${marketplace_id}/sections${NC}"
    total_tests=$((total_tests + 1))
    response=$(curl -s "${CMS_URL}/api/marketplaces/${marketplace_id}/sections")
    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, list) else 1)" 2>/dev/null; then
        count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
        echo -e "${GREEN}✅ PASSED${NC} - Found ${count} sections"
        passed_tests=$((passed_tests + 1))
        section_id=$(echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if data else '')" 2>/dev/null)
        
        # Test 7: GET /api/marketplaces/:id/sections/:sectionId
        if [ ! -z "$section_id" ]; then
            echo -e "\n${CYAN}Test 7: GET /api/marketplaces/${marketplace_id}/sections/${section_id}${NC}"
            total_tests=$((total_tests + 1))
            response=$(curl -s "${CMS_URL}/api/marketplaces/${marketplace_id}/sections/${section_id}")
            if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, dict) and 'id' in data else 1)" 2>/dev/null; then
                title=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('title', 'N/A'))" 2>/dev/null)
                echo -e "${GREEN}✅ PASSED${NC} - Section: ${title}"
                passed_tests=$((passed_tests + 1))
            else
                echo -e "${RED}❌ FAILED${NC}"
                echo "$response" | head -c 200
                echo ""
            fi
            
            # Test 8: GET /api/marketplaces/:id/sections/:sectionId/items
            echo -e "\n${CYAN}Test 8: GET /api/marketplaces/${marketplace_id}/sections/${section_id}/items${NC}"
            total_tests=$((total_tests + 1))
            response=$(curl -s "${CMS_URL}/api/marketplaces/${marketplace_id}/sections/${section_id}/items")
            if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, list) else 1)" 2>/dev/null; then
                count=$(echo "$response" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
                echo -e "${GREEN}✅ PASSED${NC} - Found ${count} items"
                passed_tests=$((passed_tests + 1))
            else
                echo -e "${RED}❌ FAILED${NC}"
                echo "$response" | head -c 200
                echo ""
            fi
        fi
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "$response" | head -c 200
        echo ""
    fi
fi

# Test 9: GET /api/marketplaces/by-route/:route
if [ ! -z "$marketplace_route" ]; then
    echo -e "\n${CYAN}Test 9: GET /api/marketplaces/by-route${marketplace_route}${NC}"
    total_tests=$((total_tests + 1))
    response=$(curl -s "${CMS_URL}/api/marketplaces/by-route${marketplace_route}")
    if echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if isinstance(data, dict) and 'id' in data else 1)" 2>/dev/null; then
        name=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin).get('name', 'N/A'))" 2>/dev/null)
        echo -e "${GREEN}✅ PASSED${NC} - Marketplace: ${name}"
        passed_tests=$((passed_tests + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "$response" | head -c 200
        echo ""
    fi
fi

# Summary
echo -e "\n${CYAN}=== Test Summary ===${NC}"
echo -e "${BLUE}Total Tests: ${total_tests}${NC}"
echo -e "${GREEN}Passed: ${passed_tests}${NC}"
failed=$((total_tests - passed_tests))
if [ $failed -gt 0 ]; then
    echo -e "${RED}Failed: ${failed}${NC}"
else
    echo -e "${GREEN}Failed: ${failed}${NC}"
fi
success_rate=$(echo "scale=1; $passed_tests * 100 / $total_tests" | bc)
echo -e "${BLUE}Success Rate: ${success_rate}%${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n${GREEN}✅ ALL TESTS PASSED!${NC}\n"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  SOME TESTS FAILED${NC}\n"
    exit 1
fi

