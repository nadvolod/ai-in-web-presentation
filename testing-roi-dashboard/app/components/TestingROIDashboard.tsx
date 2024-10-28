"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TestingData } from "../types";
import {
  initialTestingData,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";

const TestingROIDashboard = () => {
  const [automatedTests, setAutomatedTests] = useState<string>("");
  const [manualTestTime, setManualTestTime] = useState<string>("");
  const [testingData, setTestingData] = useState<TestingData[]>(() =>
    loadFromLocalStorage("testingData", initialTestingData)
  );

  useEffect(() => {
    saveToLocalStorage("testingData", testingData);
  }, [testingData]);

  const calculateHoursSaved = (tests: number, timePerTest: number) => {
    return tests * timePerTest * 4; // Assuming each test runs 4 times per month
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });
    const hoursSaved = calculateHoursSaved(
      Number(automatedTests),
      Number(manualTestTime)
    );

    setTestingData([
      ...testingData,
      {
        month: currentMonth,
        tests: Number(automatedTests),
        hoursSaved: hoursSaved,
      },
    ]);

    setAutomatedTests("");
    setManualTestTime("");
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(testingData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "testing-roi-data.json";
    link.href = url;
    link.click();
  };

  const totalHoursSaved = testingData.reduce(
    (acc, curr) => acc + curr.hoursSaved,
    0
  );
  const currentTests = testingData[testingData.length - 1]?.tests || 0;
  const monthlyHoursSaved =
    testingData[testingData.length - 1]?.hoursSaved || 0;
  const costSavings = totalHoursSaved * 100; // Assuming $100 per hour

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentTests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Hours Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalHoursSaved}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{monthlyHoursSaved} hrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Savings ($)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${costSavings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Add New Testing Data</span>
            <Button onClick={handleExportData} variant="outline">
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Number of Automated Tests
              </label>
              <Input
                type="number"
                value={automatedTests}
                onChange={(e) => setAutomatedTests(e.target.value)}
                placeholder="Enter number of tests"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Manual Test Time (hours per test)
              </label>
              <Input
                type="number"
                step="0.1"
                value={manualTestTime}
                onChange={(e) => setManualTestTime(e.target.value)}
                placeholder="Enter time per test in hours"
                required
              />
            </div>
            <Button type="submit">Add Data</Button>
          </form>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automated Tests Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tests" fill="#8884d8" name="Number of Tests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hours Saved Through Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hoursSaved" fill="#82ca9d" name="Hours Saved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestingROIDashboard;
